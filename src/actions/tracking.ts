import { head, isString, maxBy } from 'lodash'
import { compose, all, pick, isNil, values } from 'ramda'
import { Alert } from 'react-native'

import { AddRaceColumnResponseData } from 'api/endpoints/types'
import I18n from 'i18n'
import { CheckIn, CheckInUpdate } from 'models'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { getRaces } from 'selectors/race'
import * as Screens from 'navigation/Screens'
import { withDataApi } from 'helpers/actions'
import { getNowAsMillis } from 'helpers/date'
import Logger from 'helpers/Logger'
import { getUnknownErrorMessage } from 'helpers/texts'
import { DispatchType, GetStateType } from 'helpers/types'

import { updateCheckIn, updateLoadingCheckInFlag } from 'actions/checkIn'
import { startLeaderboardUpdates, stopLeaderboardUpdates } from 'actions/leaderboards'
import { startLocationUpdates, stopLocationUpdates } from 'actions/locations'
import { fetchRegattaAndRaces } from 'actions/regattas'
import { updateEventEndTime } from 'actions/sessions'
import { createNewTrack, setRaceEndTime, setRaceStartTime, startTrack, stopTrack } from 'actions/tracks'
import { getTrackedRegattaRankingMetric } from 'selectors/regatta'
import {
  getBulkGpsSetting,
  getLeaderboardEnabledSetting,
  getVerboseLoggingSetting,
} from '../selectors/settings'
import { syncAllFixes } from '../services/GPSFixService'
import { removeTrackedRegatta, resetTrackingStatistics } from './locationTrackingData'
import { updateStartLine, updateStartLineBasedOnCurrentCourse } from 'actions/communications'


export type StopTrackingAction = (data?: CheckIn) => any
export const stopTracking: StopTrackingAction = data => withDataApi({ leaderboard: data && data.regattaName })(
  async (dataApi, dispatch, getState) => {
    if (!data) {
      return
    }
    await dispatch(stopLocationUpdates())
    const leaderboardEnabled = getLeaderboardEnabledSetting(getState())
    if (leaderboardEnabled) {
      await dispatch(stopLeaderboardUpdates())
    }
    await syncAllFixes(dispatch)
    if (data.isSelfTracking && data.currentTrackName && data.currentFleet) {
      await dataApi.createAutoCourse(data.leaderboardName, data.currentTrackName, data.currentFleet)
      await dispatch(stopTrack(data.leaderboardName, data.currentTrackName, data.currentFleet))
      await dispatch(setRaceEndTime(data.leaderboardName, data.currentTrackName, data.currentFleet))
      await dispatch(updateEventEndTime(data.leaderboardName, data.eventId))
    }
    dispatch(fetchRegattaAndRaces(data.regattaName, data.secret))
    dispatch(removeTrackedRegatta())

    // clear start line
    dispatch(updateStartLine({}))
  },
)

export const startTracking = ({ data, navigation, markTracking = false }: any) => async (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  const checkInData = isString(data) ? getCheckInByLeaderboardName(data)(getState()) : data
  if (!checkInData) {
    Alert.alert(I18n.t('caption_start_tracking'), getUnknownErrorMessage())
    return
  }
  const eventIsNotBound = compose(
    all(isNil),
    values,
    pick(['competitorId', 'boatId', 'markId']))(
    checkInData)

  if (eventIsNotBound) {
    navigation.navigate(Screens.EditCompetitor, { data: checkInData, options: { startTrackingAfter: true } })
    return
  }

  dispatch(updateLoadingCheckInFlag(true))
  dispatch(resetTrackingStatistics())

  if (!markTracking) {
    navigation.navigate(Screens.Tracking)
  }
  let showAlertRaceNotStarted = false

  try { await dispatch(fetchRegattaAndRaces(checkInData.regattaName, checkInData.secret)) }
  catch (e) {}

  try {
    const shouldCreateTrack = checkInData.isSelfTracking
    const bulkTransfer = getBulkGpsSetting(getState())
    const verboseLogging = getVerboseLoggingSetting(getState())
    let newTrack

    if (shouldCreateTrack && checkInData.trackPrefix) {
      const result: AddRaceColumnResponseData[] = await dispatch(createNewTrack(checkInData.leaderboardName, checkInData.trackPrefix))
      newTrack = head(result)
      if (newTrack) {
        await dispatch(startTrack(checkInData.leaderboardName, newTrack.racename, newTrack.seriesname))
      }
    } else {
      const races = getRaces(checkInData.leaderboardName)(getState())
      const now = getNowAsMillis()
      const activeRaces = races
        .filter(race => race.trackingStartDate < now)
        .filter(race => race.trackingEndDate > now || race.trackingEndDate === null)

      if (activeRaces.length === 0) {
        showAlertRaceNotStarted = true
      } else {
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

        // clear start line
        dispatch(updateStartLine({}))

        // get starting line
        let fetchData = {regattaName: data.regattaName, raceName: latestActiveRace?.name, serverUrl: data.serverUrl}
        dispatch(updateStartLineBasedOnCurrentCourse(fetchData))
      }
    }
    const trackName = (newTrack && newTrack.racename) || checkInData.currentTrackName
    if (checkInData.isSelfTracking && trackName && checkInData.currentFleet) {
      try {
        await dispatch(setRaceStartTime(checkInData.leaderboardName, trackName, checkInData.currentFleet))
      } catch (err) {
        Logger.debug(err)
      }
    }
    dispatch(startLocationUpdates(bulkTransfer, checkInData.leaderboardName, checkInData.eventId, verboseLogging))

    const leaderboardEnabled = getLeaderboardEnabledSetting(getState())
    if (leaderboardEnabled) {
      const rankingMetric: string | undefined = getTrackedRegattaRankingMetric(getState())
      dispatch(startLeaderboardUpdates(checkInData, rankingMetric))
    }
  } catch (err) {
    throw err
  } finally {
    dispatch(updateLoadingCheckInFlag(false))

    if (showAlertRaceNotStarted && !markTracking) {
      // workaround for stuck fullscreen loading indicator when alert is called
      setTimeout(async () => Alert.alert(
          I18n.t('caption_race_not_started_yet'),
          I18n.t('text_race_not_started_yet'),
        ),
                 800)
    }
  }
}
