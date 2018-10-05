import { createAction } from 'redux-actions'

import { dataApi as api } from 'api'
import { CheckIn } from 'models'
import * as CheckInService from 'services/CheckInService'

import ApiDataException from 'api/ApiDataException'
import { fetchEntityAction } from 'helpers/actions'
import { ErrorCodes } from 'helpers/errors'
import { DispatchType, GetStateType } from 'helpers/types'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import CheckInException from 'services/CheckInService/CheckInException'

import { fetchAllRaces, fetchRegatta } from './regattas'


export const collectCheckInData = (checkInData?: CheckIn) => async (dispatch: DispatchType) => {
  if (!checkInData) {
    return
  }
  const {
    eventId,
    leaderboardName,
    competitorId,
    markId,
    boatId,
    regattaName,
    serverUrl,
  } = checkInData
  const apiCalls = api(serverUrl)

  await dispatch(fetchEntityAction(apiCalls.requestEvent)(eventId))
  await dispatch(fetchEntityAction(apiCalls.requestLeaderboard)(leaderboardName))
  await dispatch(fetchRegatta(regattaName, serverUrl))
  await dispatch(fetchAllRaces(regattaName, serverUrl))

  if (competitorId) {
    await dispatch(fetchEntityAction(apiCalls.requestCompetitor)(competitorId))
  }
  if (markId) {
    await dispatch(fetchEntityAction(apiCalls.requestMark)(leaderboardName, markId))
  }
  if (boatId) {
    await dispatch(fetchEntityAction(apiCalls.requestBoat)(boatId))
  }
  return checkInData
}

export const updateCheckIn = createAction('UPDATE_CHECK_IN')
export const removeCheckIn = createAction('REMOVE_CHECK_IN')

export const fetchCheckIn = (url: string) => async (dispatch: DispatchType) => {
  const data: CheckIn | null = CheckInService.extractData(url)
  if (!data) {
    throw new CheckInException('could not extract data.')
  }
  await dispatch(collectCheckInData(data))
  return data
}

export const checkIn = (data: CheckIn) => async (dispatch: DispatchType) => {
  if (!data) {
    throw new CheckInException('data is missing')
  }
  const body = CheckInService.checkInDeviceMappingData(data)
  await api(data.serverUrl).startDeviceMapping(data.leaderboardName, body)
  return dispatch(updateCheckIn(data))
}

export const checkInDevice = (leaderboardName: string) => async (dispatch: DispatchType, getState: GetStateType) => {
  const checkInData = getCheckInByLeaderboardName(leaderboardName)(getState())
  if (!checkInData) {
    throw ApiDataException.create(ErrorCodes.MISSING_DATA)
  }
  await api(checkInData.serverUrl).startDeviceMapping(
    leaderboardName,
    CheckInService.checkInDeviceMappingData(checkInData),
  )
}

export const checkOut = (data?: CheckIn) => async (dispatch: DispatchType) => {
  if (!data) {
    return
  }
  const body = CheckInService.checkoutDeviceMappingData(data)
  await api(data.serverUrl).stopDeviceMapping(data.leaderboardName, body)
  await dispatch(removeCheckIn(data))
}
