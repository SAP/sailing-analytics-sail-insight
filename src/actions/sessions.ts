import { find, get, head, includes, orderBy } from 'lodash'
import { Alert } from 'react-native'

import { selfTrackingApi } from 'api'
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
import { getCheckInByLeaderboardName, getTrackedCheckIn } from 'selectors/checkIn'
import { getLocationTrackingStatus } from 'selectors/location'


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
    if (!competitorInfo.boatClass || !competitorInfo.sailNumber || !competitorInfo.boatName
        || !competitorInfo.nationality) {
      throw new SessionException('user/boat data missing.')
    }
    const baseValues = {
      competitorName: competitorInfo.teamName || competitorInfo.name,
      competitorEmail: user && user.email,
      nationalityIOC: competitorInfo.nationality,
    }
    const competitor = competitorInfo.boatId && !secret ?
      await dataApi.createAndAddCompetitorWithBoat(
        regattaName,
        {
          ...baseValues,
          boatId: competitorInfo.boatId,
        },
      ) :
      await dataApi.createAndAddCompetitor(
        regattaName,
        {
          ...baseValues,
          boatclass: competitorInfo.boatClass,
          sailid: competitorInfo.sailNumber,
          ...(secret && { secret }),
          ...(secret && { deviceUuid: getDeviceId() }),
        },
      )
    if (competitorInfo.teamImage && competitorInfo.teamImage.data) {
      dataApi.uploadTeamImage(competitor.id, competitorInfo.teamImage.data, competitorInfo.teamImage.mime)
    }
    dispatch(normalizeAndReceiveEntities(competitor, competitorSchema))
    dispatch(updateCheckIn({ leaderboardName: regattaName, competitorId: competitor.id } as CheckInUpdate))
    if (user) {
      await dispatch(saveTeam(
        {
          name: competitorInfo.teamName,
          boatName: competitorInfo.boatName,
          boatClass: competitorInfo.boatClass,
          sailNumber: competitorInfo.sailNumber,
          nationality: competitorInfo.nationality,
          imageData: competitorInfo.teamImage,
          id: competitor && competitor.boat && competitor.boat.id,
        },
        { updateLastUsed: true },
      ))
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
