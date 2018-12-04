import { createAction } from 'redux-actions'

import { CheckIn } from 'models'
import * as CheckInService from 'services/CheckInService'

import { ActionQueue, fetchEntityAction, withDataApi } from 'helpers/actions'
import { DispatchType } from 'helpers/types'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import CheckInException from 'services/CheckInService/CheckInException'

import { spreadableList } from 'helpers/utils'
import { fetchAllRaces, fetchRegatta } from './regattas'


export const updateCheckIn = createAction('UPDATE_CHECK_IN')
export const removeCheckIn = createAction('REMOVE_CHECK_IN')

export const collectCheckInData = (checkInData?: CheckIn) => withDataApi(checkInData && checkInData.serverUrl)(
  async (dataApi, dispatch) => {
    if (!checkInData) {
      throw new CheckInException('missing data')
    }
    const {
      eventId,
      leaderboardName,
      competitorId,
      markId,
      boatId,
      regattaName = checkInData.leaderboardName,
      serverUrl,
    } = checkInData

    const queue = ActionQueue.create(dispatch, [
      fetchEntityAction(dataApi.requestEvent)(eventId),
      fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboardName),
      fetchRegatta(regattaName, serverUrl),
      fetchAllRaces(regattaName, serverUrl),
      ...spreadableList(competitorId, ActionQueue.createItem(
        fetchEntityAction(dataApi.requestCompetitor)(competitorId),
        { ignoreException: true },
      )),
      ...spreadableList(markId, ActionQueue.createItem(
        fetchEntityAction(dataApi.requestMark)(leaderboardName, markId),
        { ignoreException: true },
      )),
      ...spreadableList(boatId, ActionQueue.createItem(
        fetchEntityAction(dataApi.requestBoat)(boatId),
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
  await dispatch(collectCheckInData(data))
  return data
}

export const checkIn = (data: CheckIn) => withDataApi(data.serverUrl)(
  async (dataApi, dispatch) => {
    if (!data) {
      throw new CheckInException('data is missing')
    }
    const body = CheckInService.checkInDeviceMappingData(data)
    await dataApi.startDeviceMapping(data.leaderboardName, body)
    return dispatch(updateCheckIn(data))
  },
)

export const checkInDevice = (leaderboardName: string) => withDataApi({ leaderboard: leaderboardName })(
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
