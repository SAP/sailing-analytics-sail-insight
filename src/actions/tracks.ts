import { head } from 'lodash'

import ApiDataException from 'api/ApiDataException'
import { AddRaceColumnResponseData } from 'api/endpoints/types'
import { CheckInUpdate, TrackingSession } from 'models'

import { withDataApi } from 'helpers/actions'
import { getNowAsMillis } from 'helpers/date'
import { ErrorCodes } from 'helpers/errors'
import { getRaceLogUuid } from 'helpers/uuid'

import { updateCheckIn } from 'actions/checkIn'


export const createNewTrack = (regattaName: string, trackName: string) => withDataApi({ leaderboard: regattaName })(
  async (dataApi, dispatch) => {
    const result = await dataApi.addRaceColumns(regattaName, { prefix: trackName })
    const newTrack = head(result)
    if (newTrack) {
      dispatch(updateCheckIn({
        leaderboardName: regattaName,
        currentTrackName: newTrack.racename,
        currentFleet: newTrack.seriesname,
        currentRaceName: `${regattaName} ${newTrack.racename} ${newTrack.seriesname}`,
        trackPrefix: trackName,
      } as CheckInUpdate))
    }
    return result
  },
)

export const startTrack = (regattaName: string, trackName: string, fleet: string) =>
  withDataApi({ leaderboard: regattaName })(async dataApi =>
  await dataApi.setTrackingTimes(
    regattaName,
    {
      fleet,
      race_column: trackName,
      endoftrackingasmillis: getNowAsMillis(1, 'd'),
    },
  ) &&
  await dataApi.startTracking(regattaName, { fleet, race_column: trackName }),
)

export type StopTrackAction = (regattaName: string, trackName: string, fleet: string) => any
export const stopTrack: StopTrackAction = (regattaName, trackName, fleet) => withDataApi({ leaderboard: regattaName })(
  async dataApi => trackName && fleet &&
  await dataApi.setTrackingTimes(
    regattaName,
    {
      fleet,
      race_column: trackName,
      endoftrackingasmillis: getNowAsMillis(),
    },
  ) &&
  await dataApi.stopTracking(regattaName, { fleet, race_column: trackName }),
)


export const startTrackRaceColumnHandler = (session: TrackingSession) => (tracks: AddRaceColumnResponseData[]) => {
  const newTrack = head(tracks)
  if (!newTrack) {
    throw ApiDataException.create(ErrorCodes.MISSING_DATA)
  }
  return startTrack(
    session.name,
    newTrack.racename,
    newTrack.seriesname,
  )
}

export type SetRaceTimeAction = (leaderboardName: string, trackName: string, fleet: string, time?: number) => any
export const setRaceStartTime: SetRaceTimeAction =
  (leaderboardName, trackName, fleet, time) => withDataApi({ leaderboard: leaderboardName })((dataApi) => {
    const now = getNowAsMillis()
    return dataApi.sendRaceLogEvent(
      leaderboardName,
      trackName,
      fleet,
      {
        '@class': 'RaceLogStartTimeEvent',
        startTime: time || now,
        id: getRaceLogUuid(),
        competitors: [],
        createdAt: now,
        timestamp: now,
        nextStatus: 'RUNNING',
        passId: 0,
      },
    )
  })

export const setRaceEndTime: SetRaceTimeAction =
  (leaderboardName, trackName, fleet, time) => withDataApi({ leaderboard: leaderboardName })((dataApi) => {
    const now = getNowAsMillis()
    return dataApi.sendRaceLogEvent(
      leaderboardName,
      trackName,
      fleet,
      {
        '@class': 'RaceLogRaceStatusEvent',
        timestamp: time || now,
        id: getRaceLogUuid(),
        competitors: [],
        createdAt: now,
        nextStatus: 'FINISHED',
        passId: 0,
      },
    )
  })
