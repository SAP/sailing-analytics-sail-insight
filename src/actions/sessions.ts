import { selfTrackingApi } from 'api'

import AuthException from 'api/AuthException'
import { competitorSchema } from 'api/schemas'
import { trackingSessionFromFormValues } from 'forms/session'
import { ActionQueue, withDataApi } from 'helpers/actions'
import { DispatchType, GetStateType } from 'helpers/types'
import I18n from 'i18n'
import { createSharingData, SharingData, showShareSheet } from 'integrations/DeepLinking'
import { CheckIn, CheckInUpdate, TrackingSession } from 'models'
import { getUserInfo } from 'selectors/auth'
import { getFormValues } from 'selectors/form'
import { eventCreationResponseToCheckIn, getDeviceCountryIOC } from 'services/CheckInService'
import { addUserPrefix } from 'services/SessionService'
import SessionException from 'services/SessionService/SessionException'

import { checkInDevice, collectCheckInData, updateCheckIn } from 'actions/checkIn'
import { normalizeAndReceiveEntities } from 'actions/entities'
import { createNewTrack, startTrackRaceColumnHandler } from 'actions/tracks'
import { saveBoat } from 'actions/user'
import { getNowAsMillis } from 'helpers/date'


export const shareSession = (session: TrackingSession) => async () => {
  if (!session) {
    throw new SessionException('empty session.')
  }
  const sharingData: SharingData = {
    title: session.name,
    // TODO: venue from generated event?
    contentDescription: I18n.t('text_share_session_description', { venue: 'HAVEL' }),
    // contentImageUrl: session.image,
    // contentMetadata: {
      //   customMetadata: {
        //     sessionId: session.id
    //   },
    // },
  }
  const shareOptions = {
    messageHeader: I18n.t('text_share_session_message_header'),
    messageBody: I18n.t('text_share_session_message_body'),
  }
  return showShareSheet(await createSharingData(sharingData, shareOptions))
}

export const shareSessionFromForm = (formName: string) => async (dispatch: DispatchType, getState: GetStateType) => {
  const sessionValues = getFormValues(formName)(getState())
  return dispatch(shareSession(trackingSessionFromFormValues(sessionValues)))
}

export const generateSessionNameWithUserPrefix = (name: string) => (dispatch: DispatchType, getState: GetStateType) => {
  const user = getUserInfo(getState())
  if (!user.username) {
    throw AuthException.create('user info not found.')
  }
  return addUserPrefix(user.username, name)
}

export const createEvent = (session: TrackingSession) => async (dispatch: DispatchType) => {
  const response = await selfTrackingApi.createEvent(
    {
      boatclassname: session.boatClass,
      venuename: 'default', // TODO: get venue name? or position?
      eventName: session.name,
    },
    )
  return eventCreationResponseToCheckIn(response)
}

export const updateEventEndTime = (leaderboardName: string, eventId: string) =>
  withDataApi({ leaderboard: leaderboardName })(
    dataApi => dataApi.updateEvent(eventId, { enddateasmillis: getNowAsMillis() }),
  )

export const createUserAttachmentToSession = (regattaName: string, session: TrackingSession) =>
  withDataApi({ leaderboard: regattaName })(async (
    dataApi,
    dispatch: DispatchType,
    getState: GetStateType,
  ) => {
    const user = getUserInfo(getState())
    if (!user) {
      throw new SessionException('user data missing.')
    }
    const baseValues = {
      competitorName: user.fullName,
      competitorEmail: user.email,
      nationalityIOC: getDeviceCountryIOC(),
    }
    const competitor = session.boatId ?
      await dataApi.createAndAddCompetitorWithBoat(
        regattaName,
        {
          ...baseValues,
          boatId: session.boatId,
        },
      ) :
      await dataApi.createAndAddCompetitor(
        regattaName,
        {
          ...baseValues,
          boatclass: session.boatClass,
          sailid: session.sailNumber,
        },
      )
    dispatch(normalizeAndReceiveEntities(competitor, competitorSchema))
    dispatch(updateCheckIn({ leaderboardName: regattaName, competitorId: competitor.id } as CheckInUpdate))
    await dispatch(saveBoat(
      {
        name: session.boatName,
        boatClass: session.boatClass,
        sailNumber: session.sailNumber,
        id: competitor && competitor.boat && competitor.boat.id,
      },
      { updateLastUsed: true },
    ))
  },
)

export const createSessionCreationQueue = (session: TrackingSession) => (dispatch: DispatchType) => ActionQueue.create(
  dispatch,
  [
    createEvent(session),
    ActionQueue.createItemUsingPreviousResult((data: CheckIn) => collectCheckInData(data)),
    ActionQueue.createItemUsingPreviousResult((data: CheckIn) => updateCheckIn(data)),
    createUserAttachmentToSession(session.name, session),
    createNewTrack(session.name, session.trackName),
    ActionQueue.createItemUsingPreviousResult(startTrackRaceColumnHandler(session)),
    checkInDevice(session.name),
  ],
)
