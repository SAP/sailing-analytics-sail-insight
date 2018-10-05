import { head, isString } from 'lodash'
import { Alert } from 'react-native'

import { AddRaceColumnResponseData } from 'api/endpoints/types'
import { getUnknownErrorMessage } from 'helpers/texts'
import { DispatchType, GetStateType } from 'helpers/types'
import I18n from 'i18n'
import { CheckIn } from 'models'
import { navigateToTracking } from 'navigation'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { getLocationTrackingStatus } from 'selectors/location'
import * as LocationService from 'services/LocationService'

import { startLocationTracking, stopLocationTracking } from './locations'
import { fetchRegattaAndRaces } from './regattas'
import { createNewTrack, startTrack, stopTrack } from './sessions'


const start = (
  data: CheckIn,
  options: { stopBeforeTracking?: boolean, createTrack?: boolean } = {},
) => async (dispatch: DispatchType) => {
  if (options.stopBeforeTracking) {
    await dispatch(stopLocationTracking())
  }
  if (options.createTrack && data.trackPrefix) {
    const result: AddRaceColumnResponseData[] = await dispatch(createNewTrack(data.leaderboardName, data.trackPrefix))
    const newTrack = head(result)
    if (newTrack) {
      await dispatch(startTrack(data.leaderboardName, newTrack.racename, newTrack.seriesname))
    }
  }
  await dispatch(startLocationTracking(data.leaderboardName, data.eventId))
}

export type StopTrackingAction = (data?: CheckIn) => any
export const stopTracking: StopTrackingAction = data => async (dispatch: DispatchType) => {
  if (!data) {
    return
  }
  await dispatch(stopLocationTracking())
  if (data.isSelfTracking) {
    await dispatch(stopTrack(data.leaderboardName, data.currentTrackName, data.currentFleet))
  }
  dispatch(fetchRegattaAndRaces(data.regattaName))
}

export type StartTrackingAction = (data?: CheckIn | string, options?: { ignoreSelfTracking?: boolean }) => any
export const startTracking: StartTrackingAction = (data, options = {}) =>  async (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  const checkInData = isString(data) ? getCheckInByLeaderboardName(data)(getState()) : data
  if (!checkInData) {
    Alert.alert(I18n.t('caption_start_tracking'), getUnknownErrorMessage())
    return
  }
  const shouldCreateNewTrack = !options.ignoreSelfTracking && checkInData.isSelfTracking
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
                await dispatch(start(checkInData, { stopBeforeTracking: true, createTrack: shouldCreateNewTrack }))
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
        await dispatch(start(checkInData, { createTrack: shouldCreateNewTrack }))
        navigateToTracking(checkInData)
        resolve()
      } catch (err) {
        reject(err)
      }
    }
  })
}
