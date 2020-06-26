import { withDataApi } from 'helpers/actions'
import Logger from 'helpers/Logger'
import { AutoCourseUpdateState, DispatchType } from 'helpers/types'

import { PositionFix } from 'models'
import { hasValidPositionAndCourse } from 'models/PositionFix'

import { updateStartAutoCourseStatus, updateTrackingStartTimeUpdateFlag } from 'actions/locationTrackingData'
import { getTrackedCheckIn } from 'selectors/checkIn'
import { getStartAutoCourseUpdateStatus, getValidGpsFixCount, wasTrackingStartTimeUpdated } from 'selectors/location'


const TRACKING_START_TIME_FIX_LIMIT = 2
const AUTOCOURSE_FIX_LIMIT = 8

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
