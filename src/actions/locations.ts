import moment from 'moment'
import { Alert } from 'react-native'
import { createAction } from 'redux-actions'

import { dataApi as api } from 'api'
import Logger from 'helpers/Logger'
import { DispatchType, GetStateType } from 'helpers/types'
import I18n from 'i18n'
import { CheckIn, PositionFix } from 'models'
import { navigateToTracking } from 'navigation'
import { getTrackedCheckInBaseUrl } from 'selectors/checkIn'
import { getLocationTrackingStatus } from 'selectors/location'
import { getBulkGpsSetting } from 'selectors/settings'
import * as CheckInService from 'services/CheckInService'
import * as GpsFixService from 'services/GPSFixService'
import * as LocationService from 'services/LocationService'
import LocationTrackingException from 'services/LocationService/LocationTrackingException'


export const updateTrackingStatus = createAction('UPDATE_LOCATION_TRACKING_STATUS')
export const updateTrackedLeaderboard = createAction('UPDATE_TRACKED_LEADERBOARD')
export const updateTrackedEventId = createAction('UPDATE_TRACKED_EVENT_ID')
export const removeTrackedRegatta = createAction('REMOVE_TRACKED_REGATTA')
export const updateTrackedRegatta = createAction('UPDATE_TRACKED_REGATTA')
export const updateUnsentGpsFixCount = createAction('UPDATE_UNSENT_GPS_FIX_COUNT')
export const updateTrackingStatistics = createAction('UPDATE_TRACKING_STATISTICS')
export const updateLocationAccuracy = createAction('UPDATE_LOCATION_ACCURACY')
export const updateSpeedInKnots = createAction('UPDATE_SPEED_IN_KNOTS')
export const updateStartedAt = createAction('UPDATE_STARTED_AT')
export const updateHeadingInDeg = createAction('UPDATE_HEADING_IN_DEG')
export const updateDistance = createAction('UPDATE_DISTANCE')

const sendGpsFix = async (serverUrl: string, postBody: any) => {
  try {
    await api(serverUrl).sendGpsFixes(postBody)
    return true
  } catch (err) {
    Logger.debug(err)
    return false
  }
}


export const startLocationTracking = (
  leaderboardName: string,
  eventId?: string,
) => async (dispatch: DispatchType) => {
  try {
    await dispatch(updateTrackedRegatta({
      leaderboardName,
      eventId,
    }))
    await LocationService.start()
    await LocationService.changePace(true)
    GpsFixService.startPeriodicalGPSFixUpdates()
    dispatch(updateStartedAt(moment().utc().format()))
  } catch (err) {
    Logger.debug(err)
    dispatch(removeTrackedRegatta())
  }
}

export const stopLocationTracking = () => async (dispatch: DispatchType) => {
  await LocationService.changePace(false)
  await LocationService.stop()
  GpsFixService.stopGPSFixUpdatesWhenSynced()
  dispatch(removeTrackedRegatta())
}

export const handleLocation = (gpsFix: PositionFix) => async (dispatch: DispatchType, getState: GetStateType) => {
  if (!gpsFix) {
    return
  }
  const state = getState()
  const serverUrl = getTrackedCheckInBaseUrl(state)
  if (!serverUrl) {
    throw new LocationTrackingException('missing event baseUrl')
  }
  const postData = CheckInService.gpsFixPostData([gpsFix])
  if (!postData) {
    throw new LocationTrackingException('gpsFix creation failed')
  }
  if (getBulkGpsSetting(state) || !(await sendGpsFix(serverUrl, postData))) {
    GpsFixService.storeGPSFix(serverUrl, gpsFix)
  }
  await dispatch(updateUnsentGpsFixCount(GpsFixService.unsentGpsFixCount()))
  await dispatch(updateTrackingStatistics(gpsFix))
}

export const initLocationTracking = () => async (dispatch: DispatchType) => {
  const enabled = await LocationService.isEnabled()
  const status = enabled ?
  LocationService.LocationTrackingStatus.RUNNING :
  LocationService.LocationTrackingStatus.STOPPED
  dispatch(updateTrackingStatus(status))
}

export const openLocationTracking = (checkInData: CheckIn) =>  async (
  dispatch: DispatchType,
  getState: GetStateType,
) => new Promise(async (resolve, reject) => {
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
              await dispatch(stopLocationTracking())
              await dispatch(startLocationTracking(checkInData.leaderboardName, checkInData.eventId))
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
      await dispatch(startLocationTracking(checkInData.leaderboardName, checkInData.eventId))
      navigateToTracking(checkInData)
      resolve()
    } catch (err) {
      reject(err)
    }
  }
})
