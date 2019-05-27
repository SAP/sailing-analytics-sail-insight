import { head, isString, maxBy } from 'lodash'
import { Alert } from 'react-native'

import { AddRaceColumnResponseData } from 'api/endpoints/types'
import I18n from 'i18n'
import { CheckIn, CheckInUpdate } from 'models'
import { navigateToTracking } from 'navigation'
import { getCheckInByLeaderboardName } from 'selectors/checkIn'
import { getRaces } from 'selectors/race'

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
import { getTrackedRegattaRankingMetric } from 'selectors/regatta';
import { getBulkGpsSetting } from '../selectors/settings'
import { syncAllFixes } from '../services/GPSFixService'
import { deleteAllGPSFixRequests } from '../storage'
import { removeTrackedRegatta, resetTrackingStatistics } from './locationTrackingData'


export type StopTrackingAction = (data?: CheckIn) => any
export const stopTracking: StopTrackingAction = data => withDataApi({ leaderboard: data && data.regattaName })(
  async (dataApi, dispatch) => {
    if (!data) {
      return
    }
    await dispatch(stopLocationUpdates())
    await dispatch(stopLeaderboardUpdates())
    await syncAllFixes(dispatch)
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
  dispatch(updateLoadingCheckInFlag(true))
  dispatch(resetTrackingStatistics())

  deleteAllGPSFixRequests()

  navigateToTracking()
  let showAlertRaceNotStarted = false

  try {
    const shouldCreateTrack = checkInData.isSelfTracking
    const bulkTransfer = getBulkGpsSetting(getState())
    let newTrack

    if (shouldCreateTrack && checkInData.trackPrefix) {
      const result: AddRaceColumnResponseData[] = await dispatch(createNewTrack(checkInData.leaderboardName, checkInData.trackPrefix))
      newTrack = head(result)
      if (newTrack) {
        await dispatch(startTrack(checkInData.leaderboardName, newTrack.racename, newTrack.seriesname))
      }
    } else {
      await dispatch(fetchRegattaAndRaces(checkInData.regattaName, checkInData.secret))
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
              currentTrackName: latestTrackName,
            } as CheckInUpdate),
          )
          checkInData.currentTrackName = latestTrackName
        }
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
    dispatch(startLocationUpdates(bulkTransfer, checkInData.leaderboardName, checkInData.eventId))


    const rankingMetric: string | undefined = getTrackedRegattaRankingMetric(getState())
    dispatch(startLeaderboardUpdates(checkInData, rankingMetric))
  } catch (err) {
    throw err
  } finally {
    dispatch(updateLoadingCheckInFlag(false))

    if (showAlertRaceNotStarted) {
      // workaround for stuck fullscreen loading indicator when alert is called
      setTimeout(async () => Alert.alert(
          I18n.t('caption_race_not_started_yet'),
          I18n.t('text_race_not_started_yet'),
        ),
                 800)
    }
  }
}
