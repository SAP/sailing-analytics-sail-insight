import { countries } from 'country-data'
import querystring from 'query-string'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import parse from 'url-parse'

import { getApiServerUrl } from 'api/config'
import { CreateEventResponseData } from 'api/endpoints/types'
import { BRANCH_APP_DOMAIN } from 'environment'
import { getDeviceUuid } from 'helpers/uuid'
import { CheckIn, PositionFix, Race } from 'models'
import { ApiBodyKeys as CheckInBodyKeys, CheckInUpdate, urlParamsToCheckIn } from 'models/CheckIn'
import { ApiBodyKeys as GPSFixBodyKeys } from 'models/PositionFix'


export const getDeviceId = () => getDeviceUuid(DeviceInfo.getUniqueID())

export const getDeviceCountryIOC = () => {
  const deviceCountry = DeviceInfo.getDeviceCountry()
  if (!deviceCountry) {
    return
  }
  const country = countries[deviceCountry.toUpperCase()]
  return country && country.ioc
}

export const extractData = (url: string) => {
  if (!url) {
    return null
  }
  const parsedUrl = parse(url)
  const serverUrl = url.includes(BRANCH_APP_DOMAIN) ? getApiServerUrl() : parsedUrl && parsedUrl.origin

  const parsedQuery = querystring.parseUrl(url)
  const queryData = parsedQuery && parsedQuery.query
  if (!queryData) {
    return null
  }

  const checkIn = urlParamsToCheckIn(serverUrl, queryData)
  return checkIn
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

const gpsFixPostItem = (fix: PositionFix) => fix && ({
  [GPSFixBodyKeys.Latitude]: fix.latitude,
  [GPSFixBodyKeys.Longitude]: fix.longitude,
  [GPSFixBodyKeys.Timestamp]: fix.timeMillis,
  [GPSFixBodyKeys.Course]: fix.bearingInDeg || 0,
  [GPSFixBodyKeys.Speed]: fix.speedInKnots || 0,
})

export const gpsFixPostData = (fixes: PositionFix[]) => fixes && ({
  [GPSFixBodyKeys.DeviceUUID]: getDeviceUuid(DeviceInfo.getUniqueID()),
  [GPSFixBodyKeys.Fixes]: fixes.map(fix => gpsFixPostItem(fix)).filter(fix => !!fix),
})

export const eventUrl = (checkInData: any) =>
  checkInData &&
  `${checkInData.serverUrl}/gwt/Home.html?navigationTab=Regattas#EventPlace:eventId=${checkInData.eventId}`

export const leaderboardUrl = (checkInData: any) =>
  checkInData &&
  // tslint:disable-next-line max-line-length
  `${checkInData.serverUrl}/gwt/Leaderboard.html?name=${escape(checkInData.leaderboardName)}&showRaceDetails=false&embedded=true&hideToolbar=true`

export const raceUrl = (session: CheckIn, race: Race) =>
  session &&
  race.name &&
  // tslint:disable-next-line max-line-length
  `${session.serverUrl}/gwt/RaceBoard.html?regattaName=${escape(session.leaderboardName)}&raceName=${escape(race.name)}&leaderboardName=${escape(session.leaderboardName)}&eventId=${escape(session.eventId)}&mode=FULL_ANALYSIS`

export const eventCreationResponseToCheckIn = (
  response: CreateEventResponseData,
  additionalProperties?: CheckInUpdate,
) => response && ({
  eventId: response.eventid,
  leaderboardName: response.leaderboard,
  regattaName: response.regatta,
  isTraining: false,
  serverUrl: getApiServerUrl(),
  isSelfTracking: true,
  trackPrefix: additionalProperties && additionalProperties.trackPrefix,
  secret: additionalProperties && additionalProperties.secret,
} as CheckIn)

