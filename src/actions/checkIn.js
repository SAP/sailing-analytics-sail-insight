import CheckInService from 'services/CheckInService'
import * as api from 'api'

import { fetchEvent } from './events'
import { fetchLeaderboard } from './leaderboards'


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
  return api.startDeviceMapping(data.leaderboardName, body)
}
