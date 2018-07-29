import { createAction } from 'redux-actions'

import CheckInService from 'services/CheckInService'
import * as api from 'api'
import { setApiRoot } from 'api/config'

import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { fetchEvent } from './events'
import { fetchLeaderboard } from './leaderboards'
import { fetchCompetitor } from './competitors'
import { fetchMark } from './marks'
import { fetchBoat } from './boats'


export const initApiRoot = leaderboardName => (dispatch, getState) => {
  const serverUrl = getCheckInByLeaderboardName(getState(), leaderboardName)?.serverUrl
  if (!serverUrl) {
    return
  }
  setApiRoot(serverUrl)
}

export const addCheckIn = createAction('ADD_CHECK_IN')

export const collectCheckInData = checkInData => async (dispatch) => {
  if (!checkInData) {
    return
  }
  await dispatch(fetchEvent(checkInData.eventId))
  await dispatch(fetchLeaderboard(checkInData.leaderboardName))
  if (checkInData.competitorId) {
    await dispatch(fetchCompetitor(checkInData.competitorId))
  }
  if (checkInData.markId) {
    await dispatch(fetchMark(checkInData.leaderboardName, checkInData.markId))
  }
  if (checkInData.boatId) {
    await dispatch(fetchBoat(checkInData.boatId))
  }
}

export const checkIn = url => async (dispatch) => {
  const data = CheckInService.extractData(url)
  setApiRoot(data.serverUrl)
  await dispatch(collectCheckInData(data))
  const body = CheckInService.deviceMappingData(data)
  await api.startDeviceMapping(data.leaderboardName, body)
  dispatch(addCheckIn(data))
}
