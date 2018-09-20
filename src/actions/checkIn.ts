import { createAction } from 'redux-actions'

import api from 'api'
import { CheckIn } from 'models'
import * as CheckInService from 'services/CheckInService'

import { fetchEntityAction } from 'helpers/actions'
import { DispatchType } from 'helpers/types'
import CheckInException from 'services/CheckInService/CheckInException'
import { fetchAllRaces, fetchRegatta } from './regattas'


export const collectCheckInData = (checkInData: CheckIn) => async (dispatch: DispatchType) => {
  if (!checkInData) {
    return
  }
  const {
    eventId,
    leaderboardName,
    competitorId,
    markId,
    boatId,
  } = checkInData
  const apiCalls = api(checkInData.serverUrl)

  await dispatch(fetchEntityAction(apiCalls.requestEvent)(eventId))
  await dispatch(fetchEntityAction(apiCalls.requestLeaderboard)(leaderboardName))
  await dispatch(fetchRegatta(leaderboardName))
  await dispatch(fetchAllRaces(leaderboardName))

  if (competitorId) {
    await dispatch(fetchEntityAction(apiCalls.requestCompetitor)(competitorId))
  }
  if (markId) {
    await dispatch(fetchEntityAction(apiCalls.requestMark)(leaderboardName, markId))
  }
  if (boatId) {
    await dispatch(fetchEntityAction(apiCalls.requestBoat)(boatId))
  }
}

export const addCheckIn = createAction('ADD_CHECK_IN')
export const removeCheckIn = createAction('REMOVE_CHECK_IN')

export const fetchCheckIn = (url: string) => async (dispatch: DispatchType) => {
  const data: CheckIn | null = CheckInService.extractData(url)
  if (!data) {
    throw new CheckInException('could not extract data.')
  }
  await dispatch(collectCheckInData(data))
  return data
}

export const checkIn = (data?: CheckIn) => async (dispatch: DispatchType) => {
  if (!data) {
    throw new CheckInException('data is missing')
  }
  const body = CheckInService.checkInDeviceMappingData(data)
  await api(data.serverUrl).startDeviceMapping(data.leaderboardName, body)
  return dispatch(addCheckIn(data))
}

export const checkOut = (data: CheckIn) => async (dispatch: DispatchType) => {
  const body = CheckInService.checkoutDeviceMappingData(data)
  await api(data.serverUrl).stopDeviceMapping(data.leaderboardName, body)
  await dispatch(removeCheckIn(data))
}
