import { selfTrackingApi } from 'api'

import AuthException from 'api/AuthException'
import { competitorSchema } from 'api/schemas'
import { ActionQueue, withDataApi } from 'helpers/actions'
import { getNowAsMillis } from 'helpers/date'
import { DispatchType, GetStateType } from 'helpers/types'
import I18n from 'i18n'
import { createSharingData, SharingData, showShareSheet } from 'integrations/DeepLinking'
import { CheckIn, CheckInUpdate, CompetitorInfo, TrackingSession } from 'models'
import { getUserInfo } from 'selectors/auth'
import { createCheckInUrl, eventCreationResponseToCheckIn, getDeviceCountryIOC, getDeviceId } from 'services/CheckInService'
import CheckInException from 'services/CheckInService/CheckInException'
import { addUserPrefix } from 'services/SessionService'
import SessionException from 'services/SessionService/SessionException'

import { collectCheckInData, registerDevice, updateCheckIn } from 'actions/checkIn'
import { normalizeAndReceiveEntities } from 'actions/entities'
import { saveBoat } from 'actions/user'
import { getSharingUuid } from 'helpers/uuid'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { CHECK_IN_URL_KEY } from './deepLinking'


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
        [CHECK_IN_URL_KEY]: createCheckInUrl(checkIn.serverUrl, {
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
  const response = await selfTrackingApi.createEvent(
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
    if (!user || !competitorInfo.boatClass || !competitorInfo.sailNumber || !competitorInfo.boatName) {
      throw new SessionException('user/boat data missing.')
    }
    const baseValues = {
      competitorName: user.fullName,
      competitorEmail: user.email,
      nationalityIOC: getDeviceCountryIOC(),
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
    dispatch(normalizeAndReceiveEntities(competitor, competitorSchema))
    dispatch(updateCheckIn({ leaderboardName: regattaName, competitorId: competitor.id } as CheckInUpdate))
    await dispatch(saveBoat(
      {
        name: competitorInfo.boatName,
        boatClass: competitorInfo.boatClass,
        sailNumber: competitorInfo.sailNumber,
        id: competitor && competitor.boat && competitor.boat.id,
      },
      { updateLastUsed: true },
    ))
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
      createUserAttachmentToSession(session.name, session),
      registerDevice(session.name),
    ],
  )
