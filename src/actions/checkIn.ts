import { createAction } from 'redux-actions'

import api from 'api'
import CheckInService from 'services/CheckInService'

import { fetchEntityAction } from 'helpers/actions'


const collectCheckInData = (checkInData: any) => async (dispatch: (action: any) => void) => {
  if (!checkInData) {
    return
  }
  const apiCalls = api(checkInData.serverUrl)

  await dispatch(fetchEntityAction(apiCalls.requestEvent)(checkInData.eventId))
  await dispatch(fetchEntityAction(apiCalls.requestLeaderboard)(checkInData.leaderboardName))
  if (checkInData.competitorId) {
    await dispatch(fetchEntityAction(apiCalls.requestCompetitor)(checkInData.competitorId))
  }
  if (checkInData.markId) {
    await dispatch(fetchEntityAction(apiCalls.requestMark)(checkInData.leaderboardName, checkInData.markId))
  }
  if (checkInData.boatId) {
    await dispatch(fetchEntityAction(apiCalls.requestBoat)(checkInData.boatId))
  }
}

export const addCheckIn = createAction('ADD_CHECK_IN')

export const checkIn = (url: string) => async (dispatch: (action: any) => void) => {
  const data: any = CheckInService.extractData(url)
  await dispatch(collectCheckInData(data))
  const body = CheckInService.deviceMappingData(data)
  await api(data.serverUrl).startDeviceMapping(data.leaderboardName, body)
  dispatch(addCheckIn(data))
}
