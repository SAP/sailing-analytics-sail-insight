import querystring from 'query-string'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import parse from 'url-parse'

import { getDeviceUuid } from 'helpers/uuid'
import { CheckIn, GPSFix } from 'models'
import { ApiBodyKeys as CheckInBodyKeys } from 'models/CheckIn'
import { ApiBodyKeys as GPSFixBodyKeys } from 'models/GPSFix'


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

  const checkIn = CheckIn.createInstanceFromUrl(serverUrl, queryData)
  return checkIn && checkIn.isValid() ? checkIn : null
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
    [CheckInBodyKeys.DeviceType]: Platform.OS,
    [CheckInBodyKeys.DeviceUUID]: getDeviceId(),
    [CheckInBodyKeys.FromMillis]: new Date().getTime(),
    [CheckInBodyKeys.PushDeviceID]: '',
    ...(boatId && { [CheckInBodyKeys.BoatId]: boatId }),
    ...(competitorId && { [CheckInBodyKeys.CompetitorId]: competitorId }),
    ...(markId && { [CheckInBodyKeys.MarkId]: markId }),
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
    [CheckInBodyKeys.DeviceUUID]: getDeviceId(),
    [CheckInBodyKeys.ToMillis]: new Date().getTime(),
    ...(boatId && { [CheckInBodyKeys.BoatId]: boatId }),
    ...(competitorId && { [CheckInBodyKeys.CompetitorId]: competitorId }),
    ...(markId && { [CheckInBodyKeys.MarkId]: markId }),
  }
  return body
}

const gpsFixPostItem = (fix: GPSFix) => fix && ({
  [GPSFixBodyKeys.Latitude]: fix.latitude,
  [GPSFixBodyKeys.Longitude]: fix.longitude,
  [GPSFixBodyKeys.Timestamp]: fix.timeMillis,
  [GPSFixBodyKeys.Course]: fix.bearingInDeg || 0,
  [GPSFixBodyKeys.Speed]: fix.speedInKnots || 0,
})

export const gpsFixPostData = (fixes: GPSFix[]) => fixes && ({
  [GPSFixBodyKeys.DeviceUUID]: getDeviceUuid(DeviceInfo.getUniqueID()),
  [GPSFixBodyKeys.Fixes]: fixes.map(fix => gpsFixPostItem(fix)).filter(fix => !!fix),
})

export const eventUrl = (checkInData: any) =>
  checkInData &&
  `${checkInData.serverUrl}/gwt/Home.html?navigationTab=Regattas#EventPlace:eventId=${checkInData.eventId}`

export const leaderboardUrl = (checkInData: any) =>
  checkInData &&
  // tslint:disable-next-line
  `${checkInData.serverUrl}/gwt/Leaderboard.html?name=${escape(checkInData.leaderboardName)}&showRaceDetails=false&embedded=true&hideToolbar=true`

