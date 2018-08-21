import { GPSFix } from 'models'
import querystring from 'query-string'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import parse from 'url-parse'
import uuidv5 from 'uuid/v5'


const uuidNamespace = '7a6d6c8f-c634-481d-8443-adcd36c869ea'

const UrlPropertyNames = {
  BoatId: 'boat_id',
  EventId: 'event_id',
  LeaderboardName: 'leaderboard_name',
  CompetitorId: 'competitor_id',
  MarkId: 'mark_id',
}

export const BodyKeys = {
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


const createUuid = (id: string) => uuidv5(id, uuidNamespace)

export const extractData = (url: string) => {
  if (!url) {
    return null
  }
  const parsedUrl = parse(url)
  const serverUrl = parsedUrl && parsedUrl.origin
  if (!serverUrl) {
    return null
  }

  const parsedQuery = querystring.parseUrl(url)
  const queryData = parsedQuery && parsedQuery.query
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

export const deviceMappingData = (checkInData: any) => {
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

const gpsFixPostItem = (fix: GPSFix) => fix && ({
  [BodyKeys.FixesLatitude]: fix.latitude,
  [BodyKeys.FixesLongitude]: fix.longitude,
  [BodyKeys.FixesTimestamp]: fix.timeMillis,
  [BodyKeys.FixesCourse]: fix.bearingInDeg || 0,
  [BodyKeys.FixesSpeed]: fix.speedInKnots || 0,
})

export const gpsFixPostData = (fixes: GPSFix[]) => fixes && ({
  [BodyKeys.DeviceUUID]: createUuid(DeviceInfo.getUniqueID()),
  [BodyKeys.Fixes]: fixes.map(fix => gpsFixPostItem(fix)),
})

export const eventUrl = (checkInData: any) =>
  checkInData &&
  `${checkInData.serverUrl}/gwt/Home.html?navigationTab=Regattas#EventPlace:eventId=${checkInData.eventId}`

export const leaderboardUrl = (checkInData: any) =>
  checkInData &&
  `${checkInData.serverUrl}/gwt/Leaderboard.html?name=${escape(checkInData.leaderboardName)}&showRaceDetails=false&embedded=true&hideToolbar=true`

