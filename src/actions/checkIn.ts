import { Alert } from 'react-native'
import { createAction } from 'redux-actions'
import I18n from 'i18n'

import { CheckIn, CheckInUpdate } from 'models'
import { navigateToEditCompetitor, navigateToJoinRegatta, navigateToSessions } from 'navigation'
import * as CheckInService from 'services/CheckInService'
import CheckInException from 'services/CheckInService/CheckInException'


import { ActionQueue, fetchEntityAction, withDataApi } from 'helpers/actions'
import Logger from 'helpers/Logger'
import { getErrorDisplayMessage } from 'helpers/texts'
import { DispatchType, GetStateType } from 'helpers/types'
import { spreadableList } from 'helpers/utils'

import { fetchAllRaces, fetchRegatta } from 'actions/regattas'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { LocationTrackingStatus } from 'services/LocationService'
import { getLocationTrackingStatus } from 'selectors/location'

export const updateCheckIn = createAction('UPDATE_CHECK_IN')
export const removeCheckIn = createAction('REMOVE_CHECK_IN')
export const updateLoadingCheckInFlag = createAction('UPDATE_LOADING_CHECK_IN_FLAG')

export const collectCheckInData = (checkInData?: CheckIn) => withDataApi(checkInData && checkInData.serverUrl)(
  async (dataApi, dispatch) => {
    if (!checkInData) {
      throw new CheckInException('missing data')
    }
    checkInData.regattaName = checkInData.regattaName || checkInData.leaderboardName
    checkInData.leaderboardName = checkInData.leaderboardName || checkInData.regattaName
    const {
      eventId,
      leaderboardName,
      competitorId,
      markId,
      boatId,
      regattaName,
      serverUrl,
      secret,
    } = checkInData

    const queue = ActionQueue.create(dispatch, [
      ...spreadableList(eventId, fetchEntityAction(dataApi.requestEvent)(eventId, secret)),
      fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboardName, secret),
      fetchRegatta(regattaName, secret, serverUrl),
      fetchAllRaces(regattaName, secret, serverUrl),
      ...spreadableList(competitorId, ActionQueue.createItem(
        fetchEntityAction(dataApi.requestCompetitor)(leaderboardName, competitorId, secret),
        { ignoreException: true },
      )),
      ...spreadableList(markId, ActionQueue.createItem(
        fetchEntityAction(dataApi.requestMark)(leaderboardName, markId, secret),
        { ignoreException: true },
      )),
      ...spreadableList(boatId, ActionQueue.createItem(
        fetchEntityAction(dataApi.requestBoat)(leaderboardName, boatId, secret),
        { ignoreException: true },
      )),
    ])
    await queue.execute()

    return checkInData
  },
)

export const fetchCheckIn = (url: string) => async (dispatch: DispatchType) => {
  const data: CheckIn | null = CheckInService.extractData(url)
  if (!data) {
    throw new CheckInException('could not extract data.')
  }
  return await dispatch(collectCheckInData(data))
}

export const checkIn = (data: CheckIn) => async (dispatch: DispatchType) => {
  if (!data) {
    throw new CheckInException('data is missing')
  }
  dispatch(updateCheckIn(data))
  if (data.competitorId || data.markId || data.boatId) {
    await dispatch(registerDevice(data.leaderboardName))
    const update: CheckInUpdate = { leaderboardName: data.leaderboardName }
    if (data.competitorId) {
      update.trackingContext = 'COMPETITOR'
    } else if (data.boatId) {
      update.trackingContext = 'BOAT'
    } else if (data.markId) {
      update.trackingContext = 'MARK'
    }
    dispatch(updateCheckIn(update))
    navigateToSessions()
  }
  if (!data.competitorId && !data.markId && !data.boatId) {
    navigateToEditCompetitor(data)
  }
}

export const registerDevice = (leaderboardName: string) => withDataApi({ leaderboard: leaderboardName })(
  async (dataApi, dispatch, getState) => {
    const checkInData = getCheckInByLeaderboardName(leaderboardName)(getState())
    await dataApi.startDeviceMapping(
      leaderboardName,
      CheckInService.checkInDeviceMappingData(checkInData),
    )
  },
)

export const checkOut = (data?: CheckIn) => withDataApi(data && data.serverUrl)(
  async (dataApi, dispatch) => {
    if (!data) {
      return
    }
    const body = CheckInService.checkoutDeviceMappingData(data)
    await dataApi.stopDeviceMapping(data.leaderboardName, body)
    await dispatch(removeCheckIn(data))
  },
)

export const joinLinkInvitation = (checkInUrl: string) => async (dispatch: DispatchType, getState: GetStateType) => {
  let error: any
  
  if (getLocationTrackingStatus(getState()) === LocationTrackingStatus.RUNNING) {
    Alert.alert(
      I18n.t('text_deep_link_tracking_active_title'),
      I18n.t('text_deep_link_tracking_active_message'),
      [{ text: 'OK' } ],
      { cancelable: false }
    )

    return
  }

  try {
    dispatch(updateLoadingCheckInFlag(true))
    const sessionCheckIn = await dispatch(fetchCheckIn(checkInUrl))
    navigateToJoinRegatta(sessionCheckIn)
  } catch (err) {
    Logger.debug(err)
    error = err
  } finally {
    dispatch(updateLoadingCheckInFlag(false))
    if (error) {
      // workaround for stuck fullscreen loading indicator when alert is called
      setTimeout(async () => Alert.alert(getErrorDisplayMessage(error)), 800)
    }
  }
}

