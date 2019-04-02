import { head, isString } from 'lodash'
import { Alert } from 'react-native'

import { AddRaceColumnResponseData } from 'api/endpoints/types'
import I18n from 'i18n'
import { CheckIn } from 'models'
import { navigateToTracking } from 'navigation'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { getLocationTrackingStatus  } from 'selectors/location'
import * as LocationService from 'services/LocationService'

import { withDataApi } from 'helpers/actions'
import Logger from 'helpers/Logger'
import { getUnknownErrorMessage } from 'helpers/texts'
import { DispatchType, GetStateType } from 'helpers/types'

import { updateLoadingCheckInFlag } from 'actions/checkIn'
import { startLocationUpdates, stopLocationUpdates } from 'actions/locations'
import { fetchRegattaAndRaces } from 'actions/regattas'
import { updateEventEndTime } from 'actions/sessions'
import { createNewTrack, setRaceEndTime, setRaceStartTime, startTrack, stopTrack } from 'actions/tracks'
import { syncFixes } from '../services/GPSFixService'
import { removeTrackedRegatta } from './locationTrackingData'


const setupAndStartTrack = (
  data: CheckIn,
  options: { shouldClean?: boolean, shouldCreateTrack?: boolean } = {},
) => async (dispatch: DispatchType) => {
  try {
    dispatch(updateLoadingCheckInFlag(true))
    const { shouldClean, shouldCreateTrack } = options
    if (shouldClean) { await dispatch(stopLocationUpdates()) }
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
  } catch (err) {
    throw err
  } finally {
    dispatch(updateLoadingCheckInFlag(false))
  }
}

const showRunningTrackingDialog = (successAction: () => void) => Alert.alert(
  I18n.t('text_tracking_alert_already_running_title'),
  I18n.t('text_tracking_alert_already_running_message'),
  [
    { text: I18n.t('caption_cancel'), style: 'cancel' },
    { text: I18n.t('caption_ok'), onPress: successAction },
  ],
  { cancelable: true },
)

const startTrackingScreen = async (
  action: any,
  dispatch: DispatchType,
  resolve?: () => void,
  reject?: (err: any) => void,
) => {
  try {
    await dispatch(action)
    navigateToTracking()
    if (resolve) {
      resolve()
    }
  } catch (err) {
    if (reject) {
      reject(err)
    }
  }
}

const isTrackingRunning = () => async (dispatch: DispatchType, getState: GetStateType) => {
  const trackingState = getLocationTrackingStatus(getState())
  return trackingState === LocationService.LocationTrackingStatus.RUNNING || await LocationService.isEnabled()
}

export type StopTrackingAction = (data?: CheckIn) => any
export const stopTracking: StopTrackingAction = data => withDataApi({ leaderboard: data && data.regattaName })(
  async (dataApi, dispatch) => {
    if (!data) {
      return
    }
    dispatch(stopLocationUpdates())
    await syncFixes()
    if (data.isSelfTracking && data.currentTrackName && data.currentFleet) {
      await dataApi.createAutoCourse(data.leaderboardName, data.currentTrackName, data.currentFleet)
      await dispatch(stopTrack(data.leaderboardName, data.currentTrackName, data.currentFleet))
      await dispatch(setRaceEndTime(data.leaderboardName, data.currentTrackName, data.currentFleet))
      await dispatch(updateEventEndTime(data.leaderboardName, data.eventId))
    }
    dispatch(fetchRegattaAndRaces(data.regattaName, data.secret))
    dispatch(removeTrackedRegatta())
  },
)

export type StartTrackingAction = (data?: CheckIn | string) => any
export const startTracking: StartTrackingAction = data =>  async (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  const checkInData = isString(data) ? getCheckInByLeaderboardName(data)(getState()) : data
  if (!checkInData) {
    Alert.alert(I18n.t('caption_start_tracking'), getUnknownErrorMessage())
    return
  }
  return new Promise(async (resolve, reject) => {
    if (await dispatch(isTrackingRunning())) {
      showRunningTrackingDialog(() => startTrackingScreen(
        setupAndStartTrack(checkInData, { shouldCreateTrack: checkInData.isSelfTracking, shouldClean: true }),
        dispatch,
        resolve,
        reject,
      ))
    } else {
      startTrackingScreen(
        setupAndStartTrack(checkInData, { shouldCreateTrack: checkInData.isSelfTracking }),
        dispatch,
        resolve,
        reject,
      )
    }
  })
}
