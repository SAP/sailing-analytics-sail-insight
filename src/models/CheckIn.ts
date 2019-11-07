import { isEmpty, pick, values } from 'lodash'

import { getApiServerUrl } from 'api/config'
import { addUrlParams } from 'helpers/utils'


export const ApiBodyKeys = {
  EventId: 'eventId',
  BoatId: 'boatId',
  CompetitorId: 'competitorId',
  DeviceType: 'deviceType',
  DeviceUUID: 'deviceUuid',
  FromMillis: 'fromMillis',
  MarkId: 'markId',
  PushDeviceID: 'pushDeviceId',
  ToMillis: 'toMillis',
  LeaderboardName: 'leaderboardName',
  IsTraining: 'isTraining',
  ServerUrl: 'serverUrl',
  Secret: 'secret',
}

export const InvitationUrlPropertyName = {
  BoatId: 'boat_id',
  EventId: 'event_id',
  LeaderboardName: 'leaderboard_name',
  RegattaName: 'regatta_name',
  CompetitorId: 'competitor_id',
  MarkId: 'mark_id',
  Secret: 'secret',
  Server: 'server',
}

export type TrackingContext = 'COMPETITOR' | 'BOAT' | 'MARK'

export const mapResToModel = (map: any) => map && ({
  serverUrl: map[ApiBodyKeys.ServerUrl],
  eventId: map[ApiBodyKeys.EventId],
  leaderboardName: map[ApiBodyKeys.LeaderboardName],
  isTraining: map[ApiBodyKeys.IsTraining],
  competitorId: map[ApiBodyKeys.CompetitorId],
  boatId: map[ApiBodyKeys.BoatId],
  markId: map[ApiBodyKeys.MarkId],
} as CheckIn)

export const urlParamsToCheckIn = (serverUrl: string, queryData: any) => serverUrl && queryData && ({
  serverUrl,
  leaderboardName: queryData[InvitationUrlPropertyName.LeaderboardName],
  eventId: queryData[InvitationUrlPropertyName.EventId],
  isTraining: false,
  competitorId: queryData[InvitationUrlPropertyName.CompetitorId],
  boatId: queryData[InvitationUrlPropertyName.BoatId],
  markId: queryData[InvitationUrlPropertyName.MarkId],
  secret: queryData[InvitationUrlPropertyName.Secret],
  regattaName: queryData[InvitationUrlPropertyName.RegattaName],
} as CheckIn)

export const createCheckInUrlFromParams = (params: any = {}) => {
  const invitationParameters = values(InvitationUrlPropertyName)
  const relevantParams = pick(params, invitationParameters)
  if (
    isEmpty(relevantParams) ||
    (!relevantParams[InvitationUrlPropertyName.RegattaName] &&
    !relevantParams[InvitationUrlPropertyName.LeaderboardName])
  ) {
    return
  }

  const serverUrl = relevantParams[InvitationUrlPropertyName.Server] || getApiServerUrl()

  return addUrlParams(serverUrl, relevantParams)
}

export interface CheckInUpdate {
  leaderboardName: string
  serverUrl?: string
  regattaName?: string
  eventId?: string
  isTraining?: boolean
  competitorId?: string
  boatId?: string
  markId?: string
  isSelfTracking?: boolean
  currentTrackName?: string
  currentRaceName?: string
  currentFleet?: string
  trackPrefix?: string
  numberOfRaces?: number
  secret?: string
  trackingContext?: TrackingContext
}

export default interface CheckIn extends CheckInUpdate {
  serverUrl: string
  regattaName: string
  eventId: string
}
