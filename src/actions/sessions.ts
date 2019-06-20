import { find, get, head, includes, orderBy } from 'lodash'
import { Alert } from 'react-native'

import { selfTrackingApi } from 'api'
import ApiException from 'api/ApiException'
import AuthException from 'api/AuthException'
import { ManeuverChangeItem } from 'api/endpoints/types'
import { competitorSchema } from 'api/schemas'

import I18n from 'i18n'
import { createSharingData, SharingData, showShareSheet } from 'integrations/DeepLinking'
import { CheckIn, CheckInUpdate, CompetitorInfo, TrackingSession } from 'models'
import { navigateToManeuver, navigateToSessions } from 'navigation'

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


import { collectCheckInData, registerDevice, updateCheckIn } from 'actions/checkIn'
import { CHECK_IN_URL_KEY } from 'actions/deepLinking'
import { normalizeAndReceiveEntities } from 'actions/entities'
import { saveTeam } from 'actions/user'
import { getUserInfo } from 'selectors/auth'
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
    messageHeader: I18n.t('text_share_session_message_header'),
    messageBody: I18n.t('text_share_session_message_body'),
  }
  return showShareSheet(await createSharingData(sharingData, shareOptions))
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
      ...(secret && { secret }),
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
      throw new SessionException('user/boat data missing.')
    }
    const baseValues = {
      competitorName: competitorInfo.teamName || competitorInfo.name,
      competitorEmail: user && user.email,
      nationalityIOC: competitorInfo.nationality,
    }

    const serverUrl = getServerUrl(regattaName)(getState())
    const userBoat = getUserBoatByBoatName(competitorInfo.teamName)(getState())
    const boatId = get(userBoat, ['id', serverUrl])
    let competitorId = get(userBoat, ['competitorId', serverUrl])

    let registrationSuccess = false
    if (boatId && competitorId) {
      try {
        const registrationResponse = await dataApi.registerCompetitorToRegatta(
          regattaName,
          competitorId,
        )

        registrationSuccess = registrationResponse.status === 200
      } catch (err) {
        if (!(err instanceof ApiException)) {
          throw err
        }
      }
    }

    // Creates new competitorWithBoat if there isn't one on the current server
    // or if the regeistration of the existing one to the regatta failed
    let newCompetitorWithBoat
    if (!registrationSuccess) {
      newCompetitorWithBoat = await dataApi.createAndAddCompetitor(regattaName, {
        ...baseValues,
        boatclass: competitorInfo.boatClass,
        sailid: competitorInfo.sailNumber,
        ...(secret && { secret }),
        ...(secret && { deviceUuid: getDeviceId() }),
      })

      competitorId = newCompetitorWithBoat.id
    }

    if (competitorInfo.teamImage && competitorInfo.teamImage.data) {
      dataApi.uploadTeamImage(competitorId, competitorInfo.teamImage.data, competitorInfo.teamImage.mime)
    }

    if (newCompetitorWithBoat) {
      dispatch(normalizeAndReceiveEntities(newCompetitorWithBoat, competitorSchema))
    }

    dispatch(updateCheckIn({ competitorId, leaderboardName: regattaName } as CheckInUpdate))
    if (user) {
      await dispatch(
        saveTeam(
          {
            name: competitorInfo.teamName,
            boatName: competitorInfo.boatName,
            boatClass: competitorInfo.boatClass,
            sailNumber: competitorInfo.sailNumber,
            nationality: competitorInfo.nationality,
            id: {
              ...(userBoat && typeof userBoat.id === 'object' && { ...userBoat.id }),
              ...(newCompetitorWithBoat &&
                newCompetitorWithBoat.boat && { [serverUrl]: newCompetitorWithBoat.boat.id }),
            },
            competitorId: {
              ...(userBoat && { ...userBoat.competitorId }),
              ...(newCompetitorWithBoat && { [serverUrl]: newCompetitorWithBoat.id }),
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

export const registerCompetitorAndDevice = (data: CheckIn, competitorValues: CompetitorInfo) =>
  async (dispatch: DispatchType) => {
    if (!data) {
      throw new CheckInException('data is missing')
    }
    await dispatch(updateCheckIn(data))
    try {
      await dispatch(createUserAttachmentToSession(data.leaderboardName, competitorValues, data.secret))
      navigateToSessions()
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
      navigateToManeuver(maneuver)
    } catch (err) {
      Logger.debug(err)
    }
  },
)
