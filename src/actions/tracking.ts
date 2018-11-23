import { head, isString } from 'lodash'
import { Alert } from 'react-native'

import { AddRaceColumnResponseData } from 'api/endpoints/types'
import Logger from 'helpers/Logger'
import { getUnknownErrorMessage } from 'helpers/texts'
import { DispatchType, GetStateType } from 'helpers/types'
import I18n from 'i18n'
import { CheckIn } from 'models'
import { navigateToTracking } from 'navigation'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { getLocationTrackingStatus } from 'selectors/location'
import * as LocationService from 'services/LocationService'

import { startLocationUpdates, stopLocationUpdates } from './locations'
import { fetchRegattaAndRaces } from './regattas'
import { updateEventEndTime } from './sessions'
import { createNewTrack, setRaceEndTime, setRaceStartTime, startTrack, stopTrack } from './tracks'


const start = (
  data: CheckIn,
  options: { shouldClean?: boolean, shouldCreateTrack?: boolean } = {},
) => async (dispatch: DispatchType) => {
  const { shouldClean, shouldCreateTrack } = options
  if (shouldClean) {
    await dispatch(stopLocationUpdates())
  }
  let newTrack
  if (shouldCreateTrack && data.trackPrefix) {
    const result: AddRaceColumnResponseData[] = await dispatch(createNewTrack(data.leaderboardName, data.trackPrefix))
    newTrack = head(result)
    if (newTrack) {
      await dispatch(startTrack(data.leaderboardName, newTrack.racename, newTrack.seriesname))
    }
  }
  const trackName =  (newTrack && newTrack.racename) || data.currentTrackName
  if (data.isSelfTracking && trackName && data.currentFleet) {
    try {
      await dispatch(setRaceStartTime(
        data.leaderboardName,
        trackName,
        data.currentFleet,
      ))
    } catch (err) {
      Logger.debug(err)
    }
  }
  await dispatch(startLocationUpdates(data.leaderboardName, data.eventId))
}

export type StopTrackingAction = (data?: CheckIn) => any
export const stopTracking: StopTrackingAction = data => async (dispatch: DispatchType) => {
  if (!data) {
    return
  }
  await dispatch(stopLocationUpdates())
  if (data.isSelfTracking && data.currentTrackName && data.currentFleet) {
    await dispatch(stopTrack(data.leaderboardName, data.currentTrackName, data.currentFleet))
    await dispatch(setRaceEndTime(data.leaderboardName, data.currentTrackName, data.currentFleet))
    await dispatch(updateEventEndTime(data.leaderboardName, data.eventId))
  }
  dispatch(fetchRegattaAndRaces(data.regattaName))
}

export type StartTrackingAction = (data?: CheckIn | string, options?: { skipNewTrack?: boolean }) => any
export const startTracking: StartTrackingAction = (data, options = {}) =>  async (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  const checkInData = isString(data) ? getCheckInByLeaderboardName(data)(getState()) : data
  if (!checkInData) {
    Alert.alert(I18n.t('caption_start_tracking'), getUnknownErrorMessage())
    return
  }
  const shouldCreateTrack = !options.skipNewTrack && checkInData.isSelfTracking
  return new Promise(async (resolve, reject) => {
    const locationTrackingStatus = getLocationTrackingStatus(getState())

    if (locationTrackingStatus === LocationService.LocationTrackingStatus.RUNNING) {
      Alert.alert(
        I18n.t('text_tracking_alert_already_running_title'),
        I18n.t('text_tracking_alert_already_running_message'),
        [
          { text: I18n.t('caption_cancel'), style: 'cancel' },
          {
            text: I18n.t('caption_ok'), onPress: async () => {
              try {
                await dispatch(start(checkInData, { shouldCreateTrack, shouldClean: true }))
                navigateToTracking(checkInData)
                resolve()
              } catch (err) {
                reject(err)
              }
            },
          },
        ],
        { cancelable: true },
      )
    } else {
      try {
        await dispatch(start(checkInData, { shouldCreateTrack }))
        navigateToTracking(checkInData)
        resolve()
      } catch (err) {
        reject(err)
      }
    }
  })
}
