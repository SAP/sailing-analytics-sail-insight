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
}

export const UrlPropertyNames = {
  BoatId: 'boat_id',
  EventId: 'event_id',
  LeaderboardName: 'leaderboard_name',
  CompetitorId: 'competitor_id',
  MarkId: 'mark_id',
}

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
  leaderboardName : queryData[UrlPropertyNames.LeaderboardName],
  eventId : queryData[UrlPropertyNames.EventId],
  isTraining : false,
  competitorId : queryData[UrlPropertyNames.CompetitorId],
  boatId : queryData[UrlPropertyNames.BoatId],
  markId : queryData[UrlPropertyNames.MarkId],
} as CheckIn)

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
  currentFleet?: string
  trackPrefix?: string
}

export default interface CheckIn extends CheckInUpdate {
  serverUrl: string
  regattaName: string
  eventId: string
}
