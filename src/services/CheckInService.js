import querystring from 'query-string'
import parse from 'url-parse'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import uuidv5 from 'uuid/v5'

const uuidNamespace = '7a6d6c8f-c634-481d-8443-adcd36c869ea'

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

const createUuid = id => uuidv5(id, uuidNamespace)

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
    return null
  }
  const {
    boatId,
    competitorId,
    markId,
  } = checkInData

  const body = {
    [BodyKeys.DeviceType]: Platform.OS,
    [BodyKeys.DeviceUUID]: createUuid(DeviceInfo.getUniqueID()),
    [BodyKeys.FromMillis]: new Date().getTime(),
    [BodyKeys.PushDeviceID]: '',
    ...(boatId && { [BodyKeys.BoatId]: boatId }),
    ...(competitorId && { [BodyKeys.CompetitorId]: competitorId }),
    ...(markId && { [BodyKeys.MarkId]: markId }),
  }
  return body
}

const gpsFixData = (location) => {
  // TODO: transform data
}

export default {
  extractData,
  deviceMappingData,
  gpsFixData,
}
