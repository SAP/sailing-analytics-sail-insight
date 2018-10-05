import { head } from 'lodash'

import { selfTrackingApi } from 'api'

import ApiDataException from 'api/ApiDataException'
import AuthException from 'api/AuthException'
import { AddRaceColumnResponseData } from 'api/endpoints/types'
import { competitorSchema } from 'api/schemas'
import { trackingSessionFromFormValues } from 'forms/session'
import { ActionQueue, withToken } from 'helpers/actions'
import { getNowAsMillis } from 'helpers/date'
import { ErrorCodes } from 'helpers/errors'
import { DispatchType, GetStateType } from 'helpers/types'
import I18n from 'i18n'
import { createSharingData, SharingData, showShareSheet } from 'integrations/DeepLinking'
import { CheckIn, CheckInUpdate, TrackingSession } from 'models'
import { getUserInfo } from 'selectors/auth'
import { getFormValues } from 'selectors/form'
import { eventCreationResponseToCheckIn } from 'services/CheckInService'
import { addUserPrefix } from 'services/SessionService'
import SessionException from 'services/SessionService/SessionException'

import { checkInDevice, collectCheckInData, updateCheckIn } from 'actions/checkIn'
import { receiveNotNormalizedEntities } from 'actions/entities'


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

export const createSession = (session: TrackingSession) => withToken(
  async (token: string, dispatch: DispatchType) => {
    const response = await selfTrackingApi.createEvent(
      token,
      {
        boatclassname: session.boatClass,
        venuename: 'default', // TODO: get venue name? or position?
        eventName: session.name,
      },
    )
    return eventCreationResponseToCheckIn(response)
  },
)

export const createUserAttachmentToSession = (regattaName: string, session: TrackingSession) => withToken(
  async (token: string, dispatch: DispatchType, getState: GetStateType) => {
    const user = getUserInfo(getState())
    const competitor = await selfTrackingApi.createAndAddCompetitor(
      token,
      regattaName,
      {
        boatclass: session.boatClass,
        sailid: session.sailNumber,
        competitorName: user.fullName,
        competitorEmail: user.email,
      },
    )
    dispatch(receiveNotNormalizedEntities(competitor, competitorSchema))
    dispatch(updateCheckIn({ leaderboardName: regattaName, competitorId: competitor.id } as CheckInUpdate))
  },
)

export const createNewTrack = (regattaName: string, trackName: string) => withToken(
  async (token: string, dispatch: DispatchType) => {
    const result = await selfTrackingApi.addRaceColumns(token, regattaName, { prefix: trackName })
    const newTrack = head(result)
    if (newTrack) {
      dispatch(updateCheckIn({
        leaderboardName: regattaName,
        currentTrackName: newTrack.racename,
        currentFleet: newTrack.seriesname,
        trackPrefix: trackName,
      } as CheckInUpdate))
    }
    return result
  },
)

export const startTrack = (regattaName: string, trackName: string, fleet: string) => withToken(
  async token =>
    await selfTrackingApi.setTrackingTimes(
      token,
      regattaName,
      {
        fleet,
        race_column: trackName,
        endoftrackingasmillis: getNowAsMillis(1, 'd'),
      },
    ) &&
    await selfTrackingApi.startTracking(token, regattaName, { fleet, race_column: trackName }),
)

export type StopTrackAction = (regattaName: string, trackName?: string, fleet?: string) => any
export const stopTrack: StopTrackAction = (regattaName, trackName, fleet) => withToken(
  async token => trackName && fleet &&
    await selfTrackingApi.setTrackingTimes(
      token,
      regattaName,
      {
        fleet,
        race_column: trackName,
        endoftrackingasmillis: getNowAsMillis(),
      },
    ) &&
    await selfTrackingApi.stopTracking(token, regattaName, { fleet, race_column: trackName }),
)

const startTrackRaceColumnHandler = (session: TrackingSession) => (tracks: AddRaceColumnResponseData[]) => {
  const newTrack = head(tracks)
  if (!newTrack) {
    throw ApiDataException.create(ErrorCodes.MISSING_DATA)
  }
  return startTrack(
    session.name,
    newTrack.racename,
    newTrack.seriesname,
  )
}

export const createSessionCreationQueue = (session: TrackingSession) => (dispatch: DispatchType) => ActionQueue.create(
  dispatch,
  [
    createSession(session),
    ActionQueue.createItemUsingPreviousResult((checkInData: CheckIn) => collectCheckInData(checkInData)),
    ActionQueue.createItemUsingPreviousResult((checkInData: CheckIn) => updateCheckIn(checkInData)),
    createUserAttachmentToSession(session.name, session),
    createNewTrack(session.name, session.trackName),
    ActionQueue.createItemUsingPreviousResult(startTrackRaceColumnHandler(session)),
    checkInDevice(session.name),
  ],
)
