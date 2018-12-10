import { Alert } from 'react-native'
import { createAction } from 'redux-actions'

import { CheckIn, CompetitorInfo } from 'models'
import * as CheckInService from 'services/CheckInService'

import { ActionQueue, fetchEntityAction, withDataApi } from 'helpers/actions'
import { DispatchType } from 'helpers/types'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import CheckInException from 'services/CheckInService/CheckInException'

import Logger from 'helpers/Logger'
import { getErrorDisplayMessage } from 'helpers/texts'
import { spreadableList } from 'helpers/utils'
import { navigateToEditCompetitor, navigateToJoinRegatta, navigateToSessions } from 'navigation'
import { fetchAllRaces, fetchRegatta } from './regattas'
import { createUserAttachmentToSession } from './sessions'


export const updateCheckIn = createAction('UPDATE_CHECK_IN')
export const removeCheckIn = createAction('REMOVE_CHECK_IN')
export const updateLoadingCheckInFlag = createAction('UPDATE_LOADING_CHECK_IN_FLAG')

export const collectCheckInData = (checkInData?: CheckIn) => withDataApi(checkInData && checkInData.serverUrl)(
  async (dataApi, dispatch) => {
    if (!checkInData) {
      throw new CheckInException('missing data')
    }
    checkInData.regattaName = checkInData.regattaName || checkInData.leaderboardName
    const {
      eventId,
      leaderboardName,
      competitorId,
      markId,
      boatId,
      regattaName,
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
  return await dispatch(collectCheckInData(data))
}

export const checkIn = (data: CheckIn) => async (dispatch: DispatchType) => {
  if (!data) {
    throw new CheckInException('data is missing')
  }
  dispatch(updateCheckIn(data))
  if (data.competitorId) {
    await dispatch(registerDevice(data.leaderboardName))
    navigateToSessions()
  }
  if (data.secret) {
    navigateToEditCompetitor(data)
  }
}

export const registerCompetitorAndDevice = (data: CheckIn, competitorValues: CompetitorInfo) =>
  async (dispatch: DispatchType) => {
    if (!data) {
      throw new CheckInException('data is missing')
    }
    await dispatch(updateCheckIn(data))
    try {
      await dispatch(createUserAttachmentToSession(data.leaderboardName, competitorValues, data.secret))
      navigateToSessions()
    } catch (err) {
      Logger.debug(err)
      Alert.alert(getErrorDisplayMessage(err))
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

export const joinSessionInvitation = (url: string) => async (dispatch: DispatchType) => {
  let error: any
  try {
    dispatch(updateLoadingCheckInFlag(true))
    const sessionCheckIn = await dispatch(fetchCheckIn(url))
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
