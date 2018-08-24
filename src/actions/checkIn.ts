import { createAction } from 'redux-actions'

import api from 'api'
import { CheckIn } from 'models'
import * as CheckInService from 'services/CheckInService'

import { fetchEntityAction } from 'helpers/actions'
import { Dispatch } from 'helpers/types'
import CheckInException from 'services/CheckInService/CheckInException'


const collectCheckInData = (checkInData: CheckIn) => async (dispatch: Dispatch) => {
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

export const checkIn = (url: string) => async (dispatch: Dispatch) => {
  const data: CheckIn | null = CheckInService.extractData(url)
  if (!data) {
    throw new CheckInException('could not extract data.')
  }
  await dispatch(collectCheckInData(data))
  const body = CheckInService.checkInDeviceMappingData(data)
  await api(data.serverUrl).startDeviceMapping(data.leaderboardName, body)
  dispatch(addCheckIn(data))
}

export const checkOut = (data: CheckIn) => async (dispatch: Dispatch) => {
  const body = CheckInService.checkoutDeviceMappingData(data)
  await api(data.serverUrl).stopDeviceMapping(data.leaderboardName, body)
  await dispatch(removeCheckIn(data))
}

export const insertTestCheckIns = () => (dispatch: Dispatch) => {
  // tslint:disable-next-line
  const testUrl1 = 'https://d-labs.sapsailing.com/tracking/checkin?event_id=2779a422-63e8-492c-a648-7c17bffa64f4&leaderboard_name=Havel+Massenstart&competitor_id=5d57168f-6f62-4551-8312-d13ab5f2eb83'
  // tslint:disable-next-line
  const testUrl2 = 'https://d-labs.sapsailing.com/tracking/checkin?event_id=2779a422-63e8-492c-a648-7c17bffa64f4&leaderboard_name=Havel+Massenstart+2&competitor_id=5d57168f-6f62-4551-8312-d13ab5f2eb83'

  dispatch(checkIn(testUrl1))
  dispatch(checkIn(testUrl2))
}
