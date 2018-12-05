import { find, get, head, includes, isString, orderBy } from 'lodash'
import { Alert } from 'react-native'
import { createAction } from 'redux-actions'

import { AddRaceColumnResponseData, ManeuverChangeItem } from 'api/endpoints/types'
import Logger from 'helpers/Logger'
import { getUnknownErrorMessage } from 'helpers/texts'
import { AutoCourseUpdateState, DispatchType, GetStateType } from 'helpers/types'
import I18n from 'i18n'
import { CheckIn, PositionFix } from 'models'
import { navigateToManeuver, navigateToTracking } from 'navigation'
import { getCheckInByLeaderboardName, getTrackedCheckIn } from 'selectors/checkIn'
import { getLocationTrackingStatus, getStartAutoCourseUpdateStatus, getValidGpsFixCount, wasTrackingStartTimeUpdated } from 'selectors/location'
import * as LocationService from 'services/LocationService'

import { withDataApi } from 'helpers/actions'
import { hasValidPositionAndCourse } from 'models/PositionFix'
import { startLocationUpdates, stopLocationUpdates, updateValidGpsFixCount } from './locations'
import { fetchRegattaAndRaces } from './regattas'
import { updateEventEndTime } from './sessions'
import { createNewTrack, setRaceEndTime, setRaceStartTime, startTrack, stopTrack } from './tracks'


const TRACKING_START_TIME_FIX_LIMIT = 2
const AUTOCOURSE_FIX_LIMIT = 8

export const updateTrackingStartTimeUpdateFlag = createAction('UPDATE_TRACKING_START_TIME_UPDATED_FLAG')
export const updateStartAutoCourseStatus = createAction('UPDATE_START_AUTO_COURSE_STATUS')

const setupAndStartTrack = (
  data: CheckIn,
  options: { shouldClean?: boolean, shouldCreateTrack?: boolean } = {},
) => async (dispatch: DispatchType) => {
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
    await dispatch(stopLocationUpdates())
    if (data.isSelfTracking && data.currentTrackName && data.currentFleet) {
      await dispatch(stopTrack(data.leaderboardName, data.currentTrackName, data.currentFleet))
      await dispatch(setRaceEndTime(data.leaderboardName, data.currentTrackName, data.currentFleet))
      await dispatch(updateEventEndTime(data.leaderboardName, data.eventId))
      await dataApi.createAutoCourse(data.leaderboardName, data.currentTrackName, data.currentFleet)
    }
    dispatch(fetchRegattaAndRaces(data.regattaName))
  },
)

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
    if (await dispatch(isTrackingRunning())) {
      showRunningTrackingDialog(() => startTrackingScreen(
        setupAndStartTrack(checkInData, { shouldCreateTrack, shouldClean: true }),
        dispatch,
        resolve,
        reject,
      ))
    } else {
      startTrackingScreen(setupAndStartTrack(checkInData, { shouldCreateTrack }), dispatch, resolve, reject)
    }
  })
}

export const handleManeuverChange = (maneuverChangeData?: ManeuverChangeItem[]) =>
  withDataApi({ fromTracked: true })(async (dataApi, dispatch, getState) => {
    const trackedCheckIn = getTrackedCheckIn(getState())
    if (!maneuverChangeData || !trackedCheckIn || !trackedCheckIn.currentTrackName) {
      return
    }
    const trackedRaceChangeData = find(
      maneuverChangeData,
      item =>
      item.regattaName === trackedCheckIn.regattaName &&
      item.raceName &&
      trackedCheckIn.currentTrackName &&
      item.raceName.includes(trackedCheckIn.currentTrackName),
    ) as ManeuverChangeItem
    if (!trackedRaceChangeData) {
      return
    }
    try {
      const competitorManeuvers = get(
        find(
          await dataApi.requestManeuvers(
            trackedRaceChangeData.regattaName,
            trackedRaceChangeData.raceName,
            { competitorId: trackedCheckIn.competitorId },
          ),
          { competitor: trackedCheckIn.competitorId },
        ),
        'maneuvers',
      )
      const maneuver = head(orderBy(
        competitorManeuvers,
        'positionAndTime.unixtime',
        'desc',
      ))
      if (!maneuver || !includes(['JIBE', 'TACK', 'PENALTY_CIRCLE'], maneuver.maneuverType)) {
        return
      }
      const trackingStatus = getLocationTrackingStatus(getState())
      if (trackingStatus !== LocationService.LocationTrackingStatus.RUNNING) { return }
      navigateToManeuver(maneuver)
    } catch (err) {
      Logger.debug(err)
    }
  },
)

// WORKAROUND: adjust tracking start time for correct autocourse calculation via API,
// race has to have GPS fixes (MUST contain valid COG/SOG) which took place BEFORE StartOfRace or StartOfTracking
const checkAndUpdateTrackingStartTime = (gpsFix: PositionFix) => withDataApi({ fromTracked: true })(async(
  dataApi,
  dispatch,
  getState,
) => {
  const state = getState()
  const checkIn = getTrackedCheckIn(state)
  const alreadyUpdated = wasTrackingStartTimeUpdated(state)
  const validGpsFixCount = getValidGpsFixCount(state)
  if (
    validGpsFixCount < TRACKING_START_TIME_FIX_LIMIT ||
    !hasValidPositionAndCourse(gpsFix) ||
    alreadyUpdated ||
    !checkIn ||
    !checkIn.isSelfTracking ||
    !checkIn.currentTrackName ||
    !checkIn.currentFleet
  ) {
    return
  }
  try {
    await dataApi.setTrackingTimes(
      checkIn.regattaName,
      {
        fleet: checkIn.currentFleet,
        race_column: checkIn.currentTrackName,
      },
    )
    dispatch(updateTrackingStartTimeUpdateFlag(true))
  } catch (err) {
    Logger.debug(err)
  }
})

const checkAndUpdateAutoCourse = (gpsFix: PositionFix) => withDataApi({ fromTracked: true })(async(
  dataApi,
  dispatch,
  getState,
) => {
  const state = getState()
  let validGpsFixCount = getValidGpsFixCount(state)

  if (hasValidPositionAndCourse(gpsFix)) {
    validGpsFixCount = validGpsFixCount + 1
    dispatch(updateValidGpsFixCount(validGpsFixCount))
  }

  const checkIn = getTrackedCheckIn(state)
  const updateStatus: AutoCourseUpdateState = getStartAutoCourseUpdateStatus(state)
  if (
    updateStatus !== 'MISSING' ||
    validGpsFixCount < AUTOCOURSE_FIX_LIMIT ||
    !checkIn ||
    !checkIn.isSelfTracking ||
    !checkIn.currentTrackName ||
    !checkIn.currentFleet
  ) {
    return
  }
  try {
    dispatch(updateStartAutoCourseStatus('IN_PROGRESS' as AutoCourseUpdateState))
    await dataApi.createAutoCourse(checkIn.leaderboardName, checkIn.currentTrackName, checkIn.currentFleet)
    dispatch(updateStartAutoCourseStatus('DONE' as AutoCourseUpdateState))
  } catch (err) {
    Logger.debug(err)
    dispatch(updateStartAutoCourseStatus('MISSING' as AutoCourseUpdateState))
  }
})

export const checkAndUpdateRaceSettings = (gpsFix: PositionFix) => async (dispatch: DispatchType) => {
  try {
    await dispatch(checkAndUpdateTrackingStartTime(gpsFix))
    await dispatch(checkAndUpdateAutoCourse(gpsFix))
  } catch (err) {
    Logger.debug('CheckAndUpdateRaceSettings:', err)
  }
}
