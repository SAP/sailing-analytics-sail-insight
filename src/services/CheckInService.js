import querystring from 'query-string'
import parse from 'url-parse'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

const UrlPropertyNames = {
  BoatId: 'boat_id',
  EventId: 'event_id',
  LeaderboardName: 'leaderboard_name',
  CompetitorId: 'competitor_id',
  MarkId: 'mark_id',
}

const BodyKeys = {
  BoatId: 'boatId',
  CompetitorId: 'competitorId',
  DeviceType: 'deviceType',
  DeviceUUID: 'deviceUuid',
  Fixes: 'fixes',
  FixesCourse: 'course',
  FixesLatitude: 'latitude',
  FixesLongitude: 'longitude',
  FixesSpeed: 'speed',
  FixesTimestamp: 'timestamp',
  FromMillis: 'fromMillis',
  MarkId: 'markId',
  PushDeviceID: 'pushDeviceId',
  ToMillis: 'toMillis',
}

const extractData = (url) => {
  if (!url) {
    return null
  }

  const serverUrl = parse(url)?.origin
  if (!serverUrl) {
    return null
  }

  const queryData = querystring.parseUrl(url)?.query
  if (!queryData) {
    return null
  }

  const eventId = queryData[UrlPropertyNames.EventId]
  const leaderboardName = queryData[UrlPropertyNames.LeaderboardName]
  if (!eventId || !leaderboardName) {
    return null
  }

  const boatId = queryData[UrlPropertyNames.BoatId]
  const markId = queryData[UrlPropertyNames.MarkId]
  const competitorId = queryData[UrlPropertyNames.CompetitorId]

  if (!boatId && !markId && !competitorId) {
    return null
  }

  return {
    serverUrl,
    eventId,
    leaderboardName,
    isTraining: false,
    ...(boatId && { boatId }),
    ...(competitorId && { competitorId }),
    ...(markId && { markId }),
  }
}

const deviceMappingData = (checkInData) => {
  if (!checkInData) {
    return
  }
  const {
    boatId,
    competitorId,
    markId,
  } = checkInData

  const body = {
    [BodyKeys.DeviceType]: Platform.OS,
    [BodyKeys.DeviceUUID]: DeviceInfo.getUniqueID(),
    [BodyKeys.FromMillis]: new Date().getTime(),
    [BodyKeys.PushDeviceID]: '',
    ...(boatId && { [BodyKeys.BoatId]: boatId }),
    ...(competitorId && { [BodyKeys.CompetitorId]: competitorId }),
    ...(markId && { [BodyKeys.MarkId]: markId }),
  }
  console.log(body)
}


export default {
  extractData,
  deviceMappingData,
}
