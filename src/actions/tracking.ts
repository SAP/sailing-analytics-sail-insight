import { isString, maxBy } from 'lodash'
import { compose, all, pick, isNil, values } from 'ramda'
import { Alert } from 'react-native'

import I18n from 'i18n'
import { CheckInUpdate } from 'models'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { getRaces } from 'selectors/race'
import * as Screens from 'navigation/Screens'
import * as LocationService from 'services/LocationService'
import { getNowAsMillis } from 'helpers/date'
import { getUnknownErrorMessage } from 'helpers/texts'
import { DispatchType, GetStateType } from 'helpers/types'

import { updateCheckIn, updateLoadingCheckInFlag } from 'actions/checkIn'
import { updateLatestTrackedRace } from 'actions/leaderboards'
import { startLocationUpdates, stopLocationUpdates } from 'actions/locations'
import { updateTrackedRegatta } from 'actions/locationTrackingData'
import { fetchRegattaAndRaces } from 'actions/regattas'
import { isNetworkConnected as isNetworkConnectedSelector } from 'selectors/network'
import { removeTrackedRegatta, resetTrackingStatistics, updateTrackingContext } from './locationTrackingData'
import { stopUpdateStartLineBasedOnCurrentCourse, startUpdateStartLineBasedOnCurrentCourse } from 'actions/communications'

export const stopTracking = () => async (dispatch: DispatchType, getState: GetStateType) => {
  await dispatch(stopLocationUpdates())
  dispatch(removeTrackedRegatta())
  // stop updating start line start line
  dispatch(stopUpdateStartLineBasedOnCurrentCourse())
}

export const startTracking = ({ data, navigation, useLoadingSpinner = true }: any) => async (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  const checkInData = isString(data) ? getCheckInByLeaderboardName(data)(getState()) : data

  if (!checkInData) {
    Alert.alert(I18n.t('caption_start_tracking'), getUnknownErrorMessage())
    return
  }

  const markTracking = checkInData.markId
  const eventIsNotBound = compose(
    all(isNil),
    values,
    pick(['competitorId', 'boatId', 'markId']))(
    checkInData)

  if (eventIsNotBound) {
    const isNetworkConnected = isNetworkConnectedSelector(getState())
    if (isNetworkConnected) {
      navigation.navigate(Screens.JoinRegattaForTracking, { data: checkInData })
    } else {
      Alert.alert('', I18n.t('error_offline_competitor_registration'))
    }
    return
  }

  dispatch(resetTrackingStatistics())
  dispatch(updateTrackingContext(LocationService.LocationTrackingContext.REMOTE))

  if (useLoadingSpinner) {
    dispatch(updateLoadingCheckInFlag(true))
  }

  dispatch(updateLatestTrackedRace(null))
  dispatch(updateTrackedRegatta({
    leaderboardName: checkInData.leaderboardName,
    eventId: checkInData.eventId,
  }))

  if (markTracking) {
    navigation.navigate(Screens.TrackingNavigator, { screen: Screens.MarkTracking })
  } else {
    navigation.navigate(Screens.Tracking)
  }

  await dispatch(startLocationUpdates(checkInData.leaderboardName, checkInData.eventId))
  await dispatch(updateLoadingCheckInFlag(false))

  try { await dispatch(fetchRegattaAndRaces(checkInData.regattaName, checkInData.secret)) }
  catch (e) {}

  try {
    const races = getRaces(checkInData.leaderboardName)(getState())
    const now = getNowAsMillis()
    const activeRaces = races
      .filter(race => race.trackingStartDate < now)
      .filter(race => race.trackingEndDate > now || race.trackingEndDate === null)

    if (activeRaces.length !== 0) {
      const latestActiveRace = maxBy(activeRaces, 'trackingStartDate')
      const latestTrackName = latestActiveRace && latestActiveRace.columnName

      if (latestTrackName) {
        dispatch(
          updateCheckIn({
            leaderboardName: checkInData.leaderboardName,
            currentTrackName: latestTrackName
          } as CheckInUpdate),
        )
        checkInData.currentTrackName = latestTrackName
      }

      // start updating starting line
      let fetchData = {regattaName: data.regattaName, raceName: latestActiveRace?.name, serverUrl: data.serverUrl}
      dispatch(startUpdateStartLineBasedOnCurrentCourse(fetchData))
    }
  } catch (err) {
    throw err
  }
}
