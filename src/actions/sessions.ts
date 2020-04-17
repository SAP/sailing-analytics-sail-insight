import { find, get, head, includes, orderBy } from 'lodash'
import { Alert } from 'react-native'

import { authApi, selfTrackingApi } from 'api'
import ApiException from 'api/ApiException'
import AuthException from 'api/AuthException'
import { ManeuverChangeItem } from 'api/endpoints/types'
import { competitorSchema } from 'api/schemas'
import * as Screens from 'navigation/Screens'
import I18n from 'i18n'
import { createSharingData, SharingData, showShareSheet } from 'integrations/DeepLinking'
import { CheckIn, CheckInUpdate, CompetitorInfo, TrackingSession } from 'models'
import { getDefaultHandicapType, HandicapTypes } from 'models/TeamTemplate'

import { eventCreationResponseToCheckIn, getDeviceId } from 'services/CheckInService'
import CheckInException from 'services/CheckInService/CheckInException'
import * as LocationService from 'services/LocationService'
import { addUserPrefix } from 'services/SessionService'
import SessionException from 'services/SessionService/SessionException'

import { ActionQueue, withDataApi } from 'helpers/actions'
import { getNowAsMillis } from 'helpers/date'
import Logger from 'helpers/Logger'
import { getErrorDisplayMessage } from 'helpers/texts'
import { DispatchType, GetStateType } from 'helpers/types'
import { addUrlParams } from 'helpers/utils'
import { getSharingUuid } from 'helpers/uuid'

import { BRANCH_APP_DOMAIN } from 'environment'
import querystring from 'query-string'
import { collectCheckInData, registerDevice, updateCheckIn, updateCheckInAndEventInventory } from 'actions/checkIn'
import { startTracking } from 'actions/tracking'
import { CHECK_IN_URL_KEY } from 'actions/deepLinking'
import { normalizeAndReceiveEntities } from 'actions/entities'
import { selectEvent } from 'actions/events'
import { saveTeam } from 'actions/user'
import { getUserInfo, isLoggedIn } from 'selectors/auth'
import { getCheckInByLeaderboardName, getServerUrl, getTrackedCheckIn } from 'selectors/checkIn'
import { getLocationTrackingStatus } from 'selectors/location'
import { getUserBoatByBoatName } from 'selectors/user'

export const shareSession = (checkIn: CheckIn) => async () => {
  if (!checkIn || !checkIn.leaderboardName || !checkIn.eventId || !checkIn.secret) {
    throw new CheckInException('errror creating share link.')
  }

  const sharingData: SharingData = {
    title: checkIn.leaderboardName,
    // TODO: venue from generated event?
    contentDescription: I18n.t('text_share_session_description'),
    // contentImageUrl: session.image,
    contentMetadata: {
      customMetadata: {
        [CHECK_IN_URL_KEY]: addUrlParams(checkIn.serverUrl, {
          event_id: checkIn.eventId,
          leaderboard_name: checkIn.leaderboardName,
          secret: checkIn.secret,
        }),
      },
    },
  }
  const shareOptions = {
    messageHeader: I18n.t('text_share_session_message_header', { regattaName: checkIn.regattaName }),
    messageBody: I18n.t('text_share_session_message_body', { regattaName: checkIn.regattaName }),
  }
  const path = querystring.stringify({
    event_id: checkIn.eventId,
    leaderboard_name: checkIn.leaderboardName,
    secret: checkIn.secret
  })
  const checkinUrl = `${checkIn.serverUrl}/tracking/checkin?${path}`
  const controlParams = {
    $desktop_url: `https://${BRANCH_APP_DOMAIN}/invite?checkinUrl=${encodeURIComponent(checkinUrl)}`
  }
  return showShareSheet(await createSharingData(sharingData, shareOptions, controlParams))
}

export const shareSessionRegatta = (leaderboardName: string) => (dispatch: DispatchType, getState: GetStateType) => {
  const checkIn = getCheckInByLeaderboardName(leaderboardName)(getState())
  return dispatch(shareSession(checkIn))
}

export const generateSessionNameWithUserPrefix = (name: string) => (dispatch: DispatchType, getState: GetStateType) => {
  const user = getUserInfo(getState())
  if (!user.username) {
    throw AuthException.create('user info not found.')
  }
  return addUserPrefix(user.username, name)
}

export const createEvent = (session: TrackingSession, isPublic?: boolean) => async (dispatch: DispatchType) => {
  const secret = isPublic ? getSharingUuid() : undefined
  const response = await selfTrackingApi().createEvent(
    {
      boatclassname: session.boatClass,
      venuename: 'default', // TODO: get venue name? or position?
      eventName: session.name,
      competitorRegistrationType: isPublic ? 'OPEN_UNMODERATED' : 'CLOSED',
      ...(secret ? { secret } : {}),
    },
  )
  return eventCreationResponseToCheckIn(
    response,
    { secret, trackPrefix: session.trackName, leaderboardName: session.name },
  )
}

export const updateEventEndTime = (leaderboardName: string, eventId: string) =>
  withDataApi({ leaderboard: leaderboardName })(
    dataApi => dataApi.updateEvent(eventId, { enddateasmillis: getNowAsMillis() }),
  )

const getTimeOnTimeFactor = (competitorInfo: CompetitorInfo) => {
  const { handicapType = getDefaultHandicapType(), handicapValue = null } = competitorInfo.handicap || {}

  if (!handicapType || !handicapValue) return undefined

  if (handicapType === HandicapTypes.TimeOnTime) return handicapValue

  const timeOnTimeFactor = 100 / handicapValue

  return timeOnTimeFactor
}

const allowReadAccessToCompetitorAndBoat = (serverUrl: string, competitorId: string, boatId: string) => {
  const acl = {
    displayName: 'Read all',
    acl: [
      {
        groupId: null,
        actions: ['READ_PUBLIC']
      }
    ]
  }

  const api = authApi(serverUrl)

  return Promise.all([
    api.putAcl('COMPETITOR', competitorId, acl),
    api.putAcl('BOAT', boatId, acl),
  ])
}

export const createUserAttachmentToSession = (
  regattaName: string,
  competitorInfo: CompetitorInfo,
  secret?: string,
) =>
  withDataApi({ leaderboard: regattaName })(async (
    dataApi,
    dispatch: DispatchType,
    getState: GetStateType,
  ) => {
    const user = getUserInfo(getState())
    if (
      !competitorInfo.boatClass ||
      !competitorInfo.sailNumber ||
      !competitorInfo.nationality
    ) {
      throw new SessionException('user/nationality/boat data missing.')
    }
    const baseValues = {
      competitorName: competitorInfo.teamName || competitorInfo.name,
      competitorEmail: user && user.email,
      nationalityIOC: competitorInfo.nationality,
    }

    const serverUrl = getServerUrl(regattaName)(getState())
    const userBoat = getUserBoatByBoatName(competitorInfo.teamName)(getState())
    let boatId = get(userBoat, ['id', serverUrl])
    let competitorId = get(userBoat, ['competitorId', serverUrl])

    let registrationSuccess = false
    if (boatId && competitorId) {
      try {
        const registrationResponse = await dataApi.registerCompetitorToRegatta(
          regattaName,
          competitorId,
          secret
        )

        registrationSuccess = registrationResponse.status === 200

        if (registrationSuccess) {
          await dispatch(registerDevice(regattaName, { competitorId }))
        }
      } catch (err) {
        if (!(err instanceof ApiException)) {
          throw err
        }
      }
    }

    // Creates new competitorWithBoat if there isn't one on the current server
    // or if the registration of the existing one to the regatta failed
    let newCompetitorWithBoat
    if (!registrationSuccess) {
      newCompetitorWithBoat = await dataApi.createAndAddCompetitor(regattaName, {
        ...baseValues,
        boatclass: competitorInfo.boatClass,
        sailid: competitorInfo.sailNumber,
        timeontimefactor: getTimeOnTimeFactor(competitorInfo),
        ...(secret ? { secret } : {}),
        ...(secret ? { deviceUuid: getDeviceId() } : {}),
      })

      competitorId = newCompetitorWithBoat.id
      boatId = newCompetitorWithBoat.boat.id
    }

    if (competitorInfo.teamImage && competitorInfo.teamImage.data) {
      dataApi.uploadTeamImage(competitorId, competitorInfo.teamImage.data, competitorInfo.teamImage.mime)
    }

    if (newCompetitorWithBoat) {
      dispatch(normalizeAndReceiveEntities(newCompetitorWithBoat, competitorSchema))
    }

    if (user && boatId && competitorId) {
      await allowReadAccessToCompetitorAndBoat(serverUrl, competitorId, boatId)
    }

    dispatch(updateCheckInAndEventInventory({ competitorId, leaderboardName: regattaName } as CheckInUpdate))
    if (user) {
      await dispatch(
        saveTeam(
          {
            name: competitorInfo.teamName,
            boatName: competitorInfo.boatName,
            boatClass: competitorInfo.boatClass,
            sailNumber: competitorInfo.sailNumber,
            nationality: competitorInfo.nationality,
            imageData: competitorInfo.teamImage,
            handicap: competitorInfo.handicap,
            id: {
              ...(userBoat && typeof userBoat.id === 'object' ? { ...userBoat.id } : {}),
              ...(newCompetitorWithBoat &&
                newCompetitorWithBoat.boat ? { [serverUrl]: newCompetitorWithBoat.boat.id } : {}),
            },
            competitorId: {
              ...(userBoat ? { ...userBoat.competitorId } : {}),
              ...(newCompetitorWithBoat ? { [serverUrl]: newCompetitorWithBoat.id } : {}),
            },
          },
          { updateLastUsed: true },
        ),
      )
    }
  },
)

export type CreateSessionCreationQueueAction = (session: TrackingSession, options?: {isPublic?: boolean}) => any
export const createSessionCreationQueue: CreateSessionCreationQueueAction = (session, options) =>
  (dispatch: DispatchType) => ActionQueue.create(
    dispatch,
    [
      createEvent(session, options && options.isPublic),
      ActionQueue.createItemUsingPreviousResult((data: CheckIn) => collectCheckInData(data)),
      ActionQueue.createItemUsingPreviousResult((data: CheckIn) => updateCheckIn(data)),
      // Important: TrackingSession is given as CompetitorInfo
      createUserAttachmentToSession(session.name, session),
      registerDevice(session.name),
    ],
  )

export const registerCompetitorAndDevice = (data: CheckIn, competitorValues: CompetitorInfo, options: any, navigation:object) =>
  async (dispatch: DispatchType, getState) => {
    if (!data) {
      throw new CheckInException('data is missing')
    }
    await dispatch(updateCheckIn(data))
    try {
      await dispatch(createUserAttachmentToSession(data.leaderboardName, competitorValues, data.secret))

      if (options && options.startTrackingAfter) {
        const checkIn = getCheckInByLeaderboardName(data.leaderboardName)(getState())
        dispatch(startTracking({ data: checkIn, navigation }))
      } else if (options && options.selectSessionAfter) {
        dispatch(selectEvent({ data: options.selectSessionAfter, navigation }))
      } else {
        const isLogged = isLoggedIn(getState())
        isLogged ? navigation.navigate(Screens.SessionsNavigator) :
          navigation.navigate(Screens.Main, { screen: Screens.SessionsNavigator })
      }
    } catch (err) {
      Logger.debug(err)
      Alert.alert(getErrorDisplayMessage(err))
    }
  }

export const handleManeuverChange = (maneuverChangeData?: ManeuverChangeItem[]) =>
  withDataApi({ fromTracked: true })(async (dataApi, dispatch, getState) => {
    const trackedCheckIn = getTrackedCheckIn(getState())
    if (!maneuverChangeData || !trackedCheckIn || !trackedCheckIn.currentTrackName) {
      return
    }
    const trackedRaceChangeData = find(
      maneuverChangeData,
      item =>
      item.regattaName === trackedCheckIn.regattaName &&
      item.raceName &&
      trackedCheckIn.currentTrackName &&
      item.raceName.includes(trackedCheckIn.currentTrackName),
    ) as ManeuverChangeItem
    if (!trackedRaceChangeData) {
      return
    }
    try {
      const competitorManeuvers = get(
        find(
          await dataApi.requestManeuvers(
            trackedRaceChangeData.regattaName,
            trackedRaceChangeData.raceName,
            { competitorId: trackedCheckIn.competitorId, fromTime: getNowAsMillis(-1, 'hour') },
          ),
          { competitor: trackedCheckIn.competitorId },
        ),
        'maneuvers',
      )
      const maneuver = head(orderBy(
        competitorManeuvers,
        'positionAndTime.unixtime',
        'desc',
      ))
      if (!maneuver || !includes(['JIBE', 'TACK', 'PENALTY_CIRCLE'], maneuver.maneuverType)) {
        return
      }
      const trackingStatus = getLocationTrackingStatus(getState())
      if (trackingStatus !== LocationService.LocationTrackingStatus.RUNNING) { return }
      //navigateToManeuver(maneuver)
    } catch (err) {
      Logger.debug(err)
    }
  },
)
