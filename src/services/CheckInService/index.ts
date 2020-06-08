import { countries } from 'country-data'
import querystring from 'query-string'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import * as RNLocalize from "react-native-localize"
import parse from 'url-parse'

import { getApiServerUrl } from 'api/config'
import { CreateEventResponseData } from 'api/endpoints/types'
import { BRANCH_APP_DOMAIN } from 'environment'
import { getDeviceUuid } from 'helpers/uuid'
import { CheckIn, PositionFix, Race } from 'models'
import { ApiBodyKeys as CheckInBodyKeys, CheckInUpdate, urlParamsToCheckIn } from 'models/CheckIn'
import { ApiBodyKeys as GPSFixBodyKeys } from 'models/PositionFix'


export const getDeviceId = () => getDeviceUuid(DeviceInfo.getUniqueId())

export const getDeviceCountryIOC = () => {
  const deviceCountry = RNLocalize.getCountry()
  if (!deviceCountry) {
    return
  }
  const country = countries[deviceCountry.toUpperCase()]
  return country && country.ioc
}

export const extractData = (url: string): any => {
  if (!url) {
    return null
  }
  const parsedUrl = parse(url)
  let serverUrl = parsedUrl && parsedUrl.origin

  if (url.includes(BRANCH_APP_DOMAIN)) {
    // parse branch.io based invitation and extract checkinUrl
    const branchIoParsedQuery = querystring.parseUrl(url)
    const branchIoQueryData = branchIoParsedQuery && branchIoParsedQuery.query
    if (!branchIoQueryData) {
      return null
    }
    if (branchIoQueryData.checkinUrl) {
      // contains complete checkin url
      return extractData(branchIoQueryData.checkinUrl)
    }
    // extract parameters directly, only replace target server e.g. for publicInvite
    serverUrl = branchIoQueryData.server
  }

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
    secret,
  } = checkInData

  const body = {
    [CheckInBodyKeys.DeviceType]: Platform.OS,
    [CheckInBodyKeys.DeviceUUID]: getDeviceId(),
    [CheckInBodyKeys.FromMillis]: new Date().getTime(),
    [CheckInBodyKeys.PushDeviceID]: '',
    [CheckInBodyKeys.Secret]: secret,
    ...(boatId ? { [CheckInBodyKeys.BoatId]: boatId } : {}),
    ...(competitorId ? { [CheckInBodyKeys.CompetitorId]: competitorId } : {}),
    ...(markId ? { [CheckInBodyKeys.MarkId]: markId } : {}),
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
    ...(boatId ? { [CheckInBodyKeys.BoatId]: boatId } : {}),
    ...(competitorId ? { [CheckInBodyKeys.CompetitorId]: competitorId } : {}),
    ...(markId ? { [CheckInBodyKeys.MarkId]: markId } : {}),
  }
  return body
}

export const eventUrl = (checkInData: any) =>
  checkInData &&
  `${checkInData.serverUrl}/gwt/Home.html?navigationTab=Regattas#EventPlace:eventId=${checkInData.eventId}`

export const leaderboardUrl = (checkInData: any) =>
  checkInData &&
  // tslint:disable-next-line max-line-length
  `${checkInData.serverUrl}/gwt/Leaderboard.html?name=${encodeURIComponent(checkInData.leaderboardName)}&showRaceDetails=false&embedded=true&hideToolbar=true`

export const raceUrl = (session: CheckIn, race: Race) =>
  session &&
  race.name &&
  // tslint:disable-next-line max-line-length
  `${session.serverUrl}/gwt/RaceBoard.html?regattaName=${encodeURIComponent(session.leaderboardName)}&raceName=${encodeURIComponent(race.name)}&leaderboardName=${encodeURIComponent(session.leaderboardName)}&eventId=${encodeURIComponent(session.eventId)}&mode=FULL_ANALYSIS`

export const eventCreationResponseToCheckIn = (
  response: CreateEventResponseData,
  additionalProperties?: CheckInUpdate,
) => response && ({
  eventId: response.eventid,
  leaderboardName: response.leaderboard,
  regattaName: response.regatta,
  isTraining: false,
  serverUrl: getApiServerUrl(),
  //isSelfTracking: true,
  trackPrefix: additionalProperties && additionalProperties.trackPrefix,
  secret: additionalProperties && additionalProperties.secret,
  numberOfRaces: additionalProperties && additionalProperties.numberOfRaces
} as CheckIn)
