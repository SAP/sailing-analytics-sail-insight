import { Competitor, Event, Leaderboard } from 'models'

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

export default class CheckIn {

  public static createInstanceFromUrl(serverUrl: string, queryData: any) {
    if (!serverUrl || !queryData) {
      return undefined
    }
    const newInstance = new CheckIn()
    newInstance.serverUrl = serverUrl
    newInstance.eventId = queryData[UrlPropertyNames.EventId]
    newInstance.leaderboardName = queryData[UrlPropertyNames.LeaderboardName]
    newInstance.isTraining = false
    newInstance.competitorId = queryData[UrlPropertyNames.CompetitorId]
    newInstance.boatId = queryData[UrlPropertyNames.BoatId]
    newInstance.markId = queryData[UrlPropertyNames.MarkId]
    return newInstance

  }

  public static createInstance(map: any) {
    if (!map) {
      return null
    }
    const newInstance = new CheckIn()
    newInstance.competitorId = map[ApiBodyKeys.CompetitorId]
    newInstance.serverUrl = map[ApiBodyKeys.ServerUrl]
    newInstance.eventId = map[ApiBodyKeys.EventId]
    newInstance.leaderboardName = map[ApiBodyKeys.LeaderboardName]
    newInstance.isTraining = map[ApiBodyKeys.IsTraining]
    newInstance.competitorId = map[ApiBodyKeys.CompetitorId]
    newInstance.boatId = map[ApiBodyKeys.BoatId]
    newInstance.markId = map[ApiBodyKeys.MarkId]
    return newInstance
  }

  public event?: Event
  public competior?: Competitor
  public leaderboard?: Leaderboard

  public serverUrl?: string
  public eventId?: string
  public leaderboardName?: string | any
  public isTraining?: boolean = false
  public competitorId?: string
  public boatId?: string
  public markId?: string

  public isValid() {
    return this.serverUrl &&
      this.eventId &&
      this.leaderboardName &&
      (this.competitorId || this.boatId || this.markId)
  }
}
