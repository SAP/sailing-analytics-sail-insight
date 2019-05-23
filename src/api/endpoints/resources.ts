import {
  getApiServerUrl,
  getDataApiGenerator,
  getDataApiV2Generator,
  getRaceApiGenerator,
  HttpMethods,
  UrlOptions,
} from 'api/config'
import {
  AddRaceColumnResponseData,
  AddRaceColumnsBody,
  BoatClassesdBody,
  CompetitorBody,
  CompetitorManeuverItem,
  CompetitorResponseData,
  CompetitorWithBoatBody,
  CountryCodeBody,
  CreateEventBody,
  CreateEventResponseData,
  ManeuverChangeItem,
  RaceLogOptions,
  SetTrackingTimesBody,
  StartTrackingBody,
  StopTrackingBody,
  UpdateEventBody,
  WindBody,
  WindBodyData,
} from 'api/endpoints/types'
import { dataRequest, listRequest, request } from 'api/handler'
import {
  boatSchema,
  competitorSchema,
  eventSchema,
  leaderboardSchema,
  markSchema,
  raceSchema,
  regattaSchema,
} from 'api/schemas'
import { Buffer } from 'buffer'
import { get } from 'lodash'

const apiEndpoints = (serverUrl: string) => {
  const getUrlV1 = getDataApiGenerator(serverUrl)
  const getUrlV2 = getDataApiV2Generator(serverUrl)
  const getRaceUrl = getRaceApiGenerator(serverUrl)
  return {
    regatta: getUrlV1('/regattas'),
    regattaDetails: getUrlV1('/regattas/{0}'),
    regattaRaces: getUrlV1('/regattas/{0}/races'),
    regattaRaceTimes: getUrlV1('/regattas/{0}/races/{1}/times'),
    regattaRaceManeuvers: getUrlV1('/regattas/{0}/races/{1}/maneuvers'),
    addRaceColumns: getUrlV1('/regattas/{0}/addracecolumns'),
    createAndAddCompetitor: getUrlV1('/regattas/{0}/competitors/createandadd'),
    createAndAddCompetitorWithBoat: getUrlV1('/regattas/{0}/competitors/createandaddwithboat'),
    leaderboard: getUrlV1('/leaderboards/{0}'),
    leaderboardV2: getUrlV2('/leaderboards/{0}'),
    marks: getUrlV1('/leaderboards/{0}/marks/{1}'),
    startDeviceMapping: getUrlV1('/leaderboards/{0}/device_mappings/start'),
    endDeviceMapping: getUrlV1('/leaderboards/{0}/device_mappings/end'),
    startTracking: getUrlV1('/leaderboards/{0}/starttracking'),
    stopTracking: getUrlV1('/leaderboards/{0}/stoptracking'),
    setTrackingTimes: getUrlV1('/leaderboards/{0}/settrackingtimes'),
    createAutoCourse: getUrlV1('/leaderboards/{0}/autocourse'),
    boats: getUrlV1('/boats/{0}'),
    events: getUrlV1('/events/{0}'),
    gpsFixes: getUrlV1('/gps_fixes'),
    competitors: getUrlV1('/competitors/{0}'),
    createEvent: getUrlV1('/events/createEvent'),
    updateEvent: getUrlV1('/events/{0}/update'),
    putWind: getUrlV1('/wind/putWind'),
    raceLog: getRaceUrl('/racelog'),
    preferences: getUrlV1('/preferences/{0}'),
    boatClasses: getUrlV1('/boatclasses'),
    countryCodes: getUrlV1('/countrycodes'),
    teamImage: getUrlV1('/competitors/{0}/team/image'),
  }
}

const deviceMapping = (endpoint: (options?: UrlOptions) => string) => (leaderboardName: string, data: any) => request(
  endpoint({ pathParams: [leaderboardName] }),
  { method: HttpMethods.POST, body: data },
)

// tslint:disable-next-line max-line-length
const requestLeaderboardHandler = (url: (options?: UrlOptions) => string) => (leaderboardName: string, secret?: string, columnNames?: string[]) => dataRequest(
  url({ pathParams: [leaderboardName], urlParams: { secret, columnNames, raceDetails: 'ALL' } }),
  { dataSchema: leaderboardSchema },
)

type ApiFunction = () => any
export interface DataApi {
  requestRegattas: ApiFunction
  requestRegatta: (regattaName: string, secret?: string) => any
  requestRaces: (regattaName: string, secret?: string) => any
  requestRace: (regattaName: string, raceName: string, raceId?: string, secret?: string) => any
  requestLeaderboard: (leaderboardName: string, secret?: string) => any
  requestLeaderboardV2: (leaderboardName: string, secret?: string, columnNames?: string[]) => any
  requestEvent: (eventId: string, secret?: string) => any
  requestCompetitor: (leaderboardName: string, competitorId: string, secret?: string) => any
  requestMark: (leaderboardName: string, markId: string, secret?: string) => any
  requestBoat: (leaderboardName: string, boatId: string, secret?: string) => any
  startDeviceMapping: (leaderboardName: string, data: any) => any
  stopDeviceMapping: (leaderboardName: string, data: any) => any
  sendGpsFixes: (gpsFixes: any) => Promise<ManeuverChangeItem[]>
  createEvent: (body: CreateEventBody) => Promise<CreateEventResponseData>
  updateEvent: (id: string, body: UpdateEventBody) => any
  addRaceColumns: (regattaName: string, data?: AddRaceColumnsBody) => Promise<AddRaceColumnResponseData[]>
  startTracking: (leaderboardName: string, data: StartTrackingBody) => any
  stopTracking: (leaderboardName: string, data?: StopTrackingBody) => any
  setTrackingTimes: (leaderboardName: string, data: SetTrackingTimesBody) => any
  createAndAddCompetitor: (regattaName: string, data?: CompetitorBody) => Promise<CompetitorResponseData>
  createAutoCourse: (leaderboardName: string, raceColumn: string, fleet: string) => Promise<any>,
  createAndAddCompetitorWithBoat: (
    regattaName: string,
    data?: CompetitorWithBoatBody,
  ) => Promise<CompetitorResponseData>
  sendWindFix: (
    regattaName: string,
    raceName: string,
    windFix: WindBodyData,
    sourceId: string,
    sourceType?: string,
  ) => any
  sendRaceLogEvent: (
    leaderboard: string,
    track: string,
    fleet: string,
    options?: RaceLogOptions,
  ) => Promise<any>
  requestPreference: (key: string) => any
  updatePreference: (key: string, body: any) => any
  removePreference: (key: string) => any
  requestManeuvers: (
    regattaName: string,
    raceName: string,
    filter?: {competitorId?: string, fromTime?: number},
  ) => Promise<CompetitorManeuverItem[]>
  requestBoatClasses: () => Promise<BoatClassesdBody[]>
  requestCountryCodes: () => Promise<CountryCodeBody[]>
  uploadTeamImage: (competitorId: string, base64ImageData: string, mimeType: string) => any
}

const getApi: (serverUrl?: string) => DataApi = (serverUrl) => {
  const endpoints = apiEndpoints(serverUrl ? serverUrl : getApiServerUrl())
  return {
    requestRegattas: () => listRequest(endpoints.regatta()),
    requestRegatta: (regattaName, secret) => dataRequest(
        endpoints.regattaDetails({ pathParams: [regattaName], urlParams: { secret } }),
        { dataSchema: regattaSchema },
    ),
    requestRaces: (regattaName, secret) => dataRequest(
      endpoints.regattaRaces({ pathParams: [regattaName], urlParams: { secret } }),
      { dataSchema: regattaSchema },
    ),
    requestRace: (regattaName, raceName, raceId, secret) => dataRequest(
      endpoints.regattaRaceTimes({ pathParams: [regattaName, raceName], urlParams: { secret } }),
      {
        dataSchema: raceSchema,
        dataProcessor: raceId ? ((data: any) => data && { ...data, id: raceId }) : undefined,
      },
    ),
    requestLeaderboard: requestLeaderboardHandler(endpoints.leaderboard),
    requestLeaderboardV2: requestLeaderboardHandler(endpoints.leaderboardV2),
    requestEvent: (eventId, secret) => dataRequest(
        endpoints.events({ pathParams: [eventId], urlParams: { secret } }),
        { dataSchema: eventSchema },
    ),
    requestCompetitor: (leaderboardName, competitorId, secret) => dataRequest(
        endpoints.competitors({ pathParams: [competitorId], urlParams: { leaderboardName, secret } }),
        { dataSchema: competitorSchema },
    ),
    requestMark: (leaderboardName, markId, secret) => dataRequest(
        endpoints.marks({ pathParams: [leaderboardName, markId], urlParams: { secret } }),
        { dataSchema: markSchema },
    ),
    requestBoat: (leaderboardName, boatId, secret)  => dataRequest(
        endpoints.boats({ pathParams: [boatId], urlParams: { leaderboardName, secret } }),
        { dataSchema: boatSchema },
    ),
    startDeviceMapping: deviceMapping(endpoints.startDeviceMapping),
    stopDeviceMapping: deviceMapping(endpoints.endDeviceMapping),
    sendGpsFixes: gpsFixes => dataRequest(
      endpoints.gpsFixes(),
      {
        method: HttpMethods.POST,
        body: gpsFixes,
        dataProcessor:  data => get(data, 'maneuverchanged'),
      },
    ),
    createEvent: body => dataRequest(
      endpoints.createEvent(),
      {
        body,
        method: HttpMethods.POST,
        bodyType: 'x-www-form-urlencoded',
      },
    ),
    updateEvent: (id, body) => dataRequest(
      endpoints.updateEvent({ pathParams: [id] }),
      {
        body,
        method: HttpMethods.PUT,
        bodyType: 'x-www-form-urlencoded',
      },
    ),
    addRaceColumns: (regattaName, data) => dataRequest(
      endpoints.addRaceColumns({ urlParams: data, pathParams: [regattaName] }),
      { method: HttpMethods.POST },
    ),
    startTracking: (leaderboardName, data) => dataRequest(
      endpoints.startTracking({ pathParams: [leaderboardName], urlParams: data }),
      { method: HttpMethods.POST },
    ),
    stopTracking: (leaderboardName, data) => dataRequest(
      endpoints.stopTracking({ pathParams: [leaderboardName], urlParams: data }),
      { method: HttpMethods.POST },
    ),
    setTrackingTimes: (leaderboardName, data) => dataRequest(
      endpoints.setTrackingTimes({ pathParams: [leaderboardName], urlParams: data }),
      { method: HttpMethods.POST },
    ),
    createAndAddCompetitor: (regattaName, data) => dataRequest(
      endpoints.createAndAddCompetitor({ pathParams: [regattaName], urlParams: data }),
      { method: HttpMethods.POST },
    ),
    createAndAddCompetitorWithBoat: (regattaName, data) => dataRequest(
      endpoints.createAndAddCompetitorWithBoat({ pathParams: [regattaName], urlParams: data }),
      { method: HttpMethods.POST },
    ),
    sendWindFix: (regattaName, raceName, windFix, sourceId, sourceType = 'WEB') => request(
      endpoints.putWind(),
      {
        method: HttpMethods.PUT,
        body: {
          windSourceType: sourceType,
          windSourceId: sourceId,
          windData: [windFix],
          regattaNamesAndRaceNames: [{ raceName, regattaName }],
        } as WindBody,
      },
    ),
    sendRaceLogEvent: (leaderboard, track, fleet, options) => request(
      endpoints.raceLog({ urlParams: { leaderboard, fleet, race_column: track } }),
      { body: options, method: HttpMethods.POST },
    ),
    requestPreference: key => dataRequest(
      endpoints.preferences({ pathParams: [key] }),
    ),
    updatePreference: (key, body) => dataRequest(
      endpoints.preferences({ pathParams: [key] }),
      { body, method: HttpMethods.PUT },
    ),
    removePreference: key => dataRequest(
      endpoints.preferences({ pathParams: [key] }),
      { method: HttpMethods.DELETE },
    ),
    requestManeuvers: (regattaName, raceName, filters) => dataRequest(
      endpoints.regattaRaceManeuvers({ pathParams: [regattaName, raceName], urlParams: filters }),
      { dataProcessor: data => get(data, 'bycompetitor') },
    ),
    createAutoCourse: (leaderboardName, raceColumn, fleet) => dataRequest(
      endpoints.createAutoCourse({ pathParams: [leaderboardName], urlParams: { fleet, race_column: raceColumn } }),
      { method: HttpMethods.POST },
    ),
    requestBoatClasses: () => listRequest(endpoints.boatClasses()),
    requestCountryCodes: () => listRequest(endpoints.countryCodes()),
    uploadTeamImage: (competitorId, base64ImageData, mimeType) => dataRequest(
      endpoints.teamImage({ pathParams: [competitorId] }),
      {
        method: HttpMethods.POST,
        body: Buffer.from(base64ImageData, 'base64'),
        bodyType: 'image',
        timeout: 60000,
      },
    ),
  }
}

export default getApi
