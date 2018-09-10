import querystring from 'query-string'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import parse from 'url-parse'

import { getDeviceUuid } from 'helpers/uuid'
import { CheckIn, GPSFix } from 'models'


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


export const getDeviceId = () => getDeviceUuid(DeviceInfo.getUniqueID())

export const extractData = (url: string) => {
  if (!url) {
    return null
  }
  const parsedUrl = parse(url)
  const serverUrl = parsedUrl && parsedUrl.origin

  const parsedQuery = querystring.parseUrl(url)
  const queryData = parsedQuery && parsedQuery.query
  if (!queryData) {
    return null
  }

  const checkIn = new CheckIn(
    serverUrl,
    queryData[UrlPropertyNames.EventId],
    queryData[UrlPropertyNames.LeaderboardName],
    false,
    queryData[UrlPropertyNames.CompetitorId],
    queryData[UrlPropertyNames.BoatId],
    queryData[UrlPropertyNames.MarkId],
  )

  return checkIn.isValid() ? checkIn : null
}

export const checkInDeviceMappingData = (checkInData: CheckIn) => {
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
    [BodyKeys.DeviceUUID]: getDeviceId(),
    [BodyKeys.FromMillis]: new Date().getTime(),
    [BodyKeys.PushDeviceID]: '',
    ...(boatId && { [BodyKeys.BoatId]: boatId }),
    ...(competitorId && { [BodyKeys.CompetitorId]: competitorId }),
    ...(markId && { [BodyKeys.MarkId]: markId }),
  }
  return body
}

export const checkoutDeviceMappingData = (checkInData: CheckIn) => {
  if (!checkInData) {
    return null
  }
  const {
    boatId,
    competitorId,
    markId,
  } = checkInData

  const body = {
    [BodyKeys.DeviceUUID]: getDeviceId(),
    [BodyKeys.ToMillis]: new Date().getTime(),
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
  [BodyKeys.DeviceUUID]: getDeviceUuid(DeviceInfo.getUniqueID()),
  [BodyKeys.Fixes]: fixes.map(fix => gpsFixPostItem(fix)).filter(fix => !!fix),
})

export const eventUrl = (checkInData: any) =>
  checkInData &&
  `${checkInData.serverUrl}/gwt/Home.html?navigationTab=Regattas#EventPlace:eventId=${checkInData.eventId}`

export const leaderboardUrl = (checkInData: any) =>
  checkInData &&
  // tslint:disable-next-line
  `${checkInData.serverUrl}/gwt/Leaderboard.html?name=${escape(checkInData.leaderboardName)}&showRaceDetails=false&embedded=true&hideToolbar=true`

