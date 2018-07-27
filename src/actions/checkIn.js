import { createAction } from 'redux-actions'

import CheckInService from 'services/CheckInService'
import * as api from 'api'
import { setApiRoot } from 'api/config'
import { getCheckInData } from 'selectors/checkIn'

import { fetchEvent } from './events'
import { fetchLeaderboard } from './leaderboards'


export const initExistingCheckIn = () => (dispatch, getState) => {
  const serverUrl = getCheckInData(getState())?.serverUrl
  if (!serverUrl) {
    return
  }
  setApiRoot(serverUrl)
}

export const updateCurrentCheckIn = createAction('UPDATE_CHECK_IN')

export const collectCheckInData = checkInData => async (dispatch) => {
  if (!checkInData) {
    return
  }
  await dispatch(fetchEvent(checkInData.eventId))
  await dispatch(fetchLeaderboard(checkInData.leaderboardName))
}

export const checkIn = url => async (dispatch) => {
  const data = CheckInService.extractData(url)
  await dispatch(collectCheckInData(data))
  const body = CheckInService.deviceMappingData(data)
  await api.startDeviceMapping(data.leaderboardName, body)
  dispatch(updateCurrentCheckIn(data))
}
