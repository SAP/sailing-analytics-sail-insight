import { createAction } from 'redux-actions'

import api from 'api'
import { CheckIn } from 'models'
import * as CheckInService from 'services/CheckInService'

import { fetchEntityAction } from 'helpers/actions'
import { DispatchType } from 'helpers/types'
import CheckInException from 'services/CheckInService/CheckInException'


const collectCheckInData = (checkInData: CheckIn) => async (dispatch: DispatchType) => {
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

export const insertTestCheckIns = () => async (dispatch: DispatchType) => {
  // tslint:disable-next-line
  const testUrl1 = 'https://d-labs.sapsailing.com/tracking/checkin?event_id=2779a422-63e8-492c-a648-7c17bffa64f4&leaderboard_name=Havel+Massenstart&competitor_id=5d57168f-6f62-4551-8312-d13ab5f2eb83'
  // tslint:disable-next-line
  const testUrl2 = 'https://d-labs.sapsailing.com/tracking/checkin?event_id=2779a422-63e8-492c-a648-7c17bffa64f4&leaderboard_name=Havel+Massenstart+2&competitor_id=5d57168f-6f62-4551-8312-d13ab5f2eb83'
  // tslint:disable-next-line
  const testUrl3 = 'https://d-labs.sapsailing.com/tracking/checkin?event_id=2779a422-63e8-492c-a648-7c17bffa64f4&leaderboard_name=Havel-Massenstart-03&competitor_id=3947cddd-f52b-43b2-9390-cd54b9eb9f12'
  // tslint:disable-next-line
  const testUrl4 = 'https://dev.sapsailing.com/tracking/checkin?event_id=3c9ddca7-d5e4-4c24-8e31-49747efc9972&leaderboard_name=Dorians+Havelregatta+01&competitor_id=9141957d-3e53-4512-9a9b-5f52c9233900'
  // tslint:disable-next-line
  const testUrl5 = 'https://dev.sapsailing.com/tracking/checkin?event_id=cc6b60c9-ab0f-4664-bfd4-22342ff6210c&leaderboard_name=D-Labs+Test+Laser&competitor_id=ca548a34-889b-40ad-9685-1f6a856ccd9d'

  // dispatch(checkIn(testUrl1))
  // dispatch(checkIn(testUrl2))
  // dispatch(checkIn(testUrl3))
  // dispatch(checkIn(await dispatch(fetchCheckIn(testUrl4))))
  dispatch(checkIn(await dispatch(fetchCheckIn(testUrl5))))
}
