import { tokenSigner } from 'api/authorization'
import { HttpMethods, urlGenerator, UrlOptions } from 'api/config'
import {
  AddRaceColumnResponseData,
  AddRaceColumnsBody,
  CompetitorBody,
  CompetitorResponseData,
  CreateEventBody,
  CreateEventResponseData,
  SetTrackingTimesBody,
  StartTrackingBody,
  StopTrackingBody,
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


const apiEndpoints = (serverUrl: string) => {
  const getUrl = urlGenerator(serverUrl)
  return {
    regatta: getUrl('/regattas'),
    regattaRaces: getUrl('/regattas/{0}/races'),
    regattaRaceTimes: getUrl('/regattas/{0}/races/{1}/times'),
    leaderboards: getUrl('/leaderboards'),
    boats: getUrl('/boats'),
    events: getUrl('/events'),
    gpsFixes: getUrl('/gps_fixes'),
    competitors: getUrl('/competitors'),
    marks: getUrl('/leaderboards/{0}/marks'),
    startDeviceMapping: getUrl('/leaderboards/{0}/device_mappings/start'),
    endDeviceMapping: getUrl('/leaderboards/{0}/device_mappings/end'),
    createEvent: getUrl('/events/createEvent'),
    addRaceColumns: getUrl('/regattas/{0}/addracecolumns'),
    startTracking: getUrl('/leaderboards/{0}/starttracking'),
    stopTracking: getUrl('/leaderboards/{0}/stoptracking'),
    setTrackingTimes: getUrl('/leaderboards/{0}/settrackingtimes'),
    createAndAddCompetitor: getUrl('/regattas/{0}/competitors/createandadd'),
    putWind: getUrl('/wind/putWind'),
  }
}

const deviceMapping = (endpoint: (options?: UrlOptions) => string) => (leaderboardName: string, data: any) => request(
  endpoint({ pathParams: [leaderboardName] }),
  { method: HttpMethods.POST, body: data },
)


export default (serverUrl: string) => {
  const endpoints = apiEndpoints(serverUrl)
  return {
    requestRegattas: () => listRequest(endpoints.regatta()),
    requestRegatta: (regattaName: string) => dataRequest(
      `${endpoints.regatta()}/${escape(regattaName)}`,
      { dataSchema: regattaSchema },
    ),
    requestRaces: (regattaName: string) => dataRequest(
      endpoints.regattaRaces({ pathParams: [regattaName] }),
      { dataSchema: regattaSchema },
    ),
    requestRace: (regattaName: string, raceName: string, raceId?: string) => dataRequest(
      endpoints.regattaRaceTimes({ pathParams: [regattaName, raceName] }),
      {
        dataSchema: raceSchema,
        dataProcessor: raceId ? ((data: any) => data && { ...data, id: raceId }) : undefined,
      },
    ),
    requestLeaderboards: () => listRequest(endpoints.leaderboards(), { dataSchema: leaderboardSchema }),
    requestLeaderboard: (leaderboardName: string) => dataRequest(
      `${endpoints.leaderboards()}/${escape(leaderboardName)}`,
      { dataSchema: leaderboardSchema },
    ),
    requestEvent: (eventId: string) => dataRequest(`${endpoints.events()}/${eventId}`, { dataSchema: eventSchema }),
    requestCompetitor: (competitorId: string) => dataRequest(
      `${endpoints.competitors()}/${competitorId}`,
      { dataSchema: competitorSchema },
    ),
    requestMark: (leaderboardName: string, id: string) => dataRequest(
      `${endpoints.marks({ pathParams: [leaderboardName] })}/${id}`,
      { dataSchema: markSchema },
    ),
    requestBoat: (id: string) => dataRequest(
      `${endpoints.boats()}/${id}`,
      { dataSchema: boatSchema },
    ),
    startDeviceMapping: deviceMapping(endpoints.startDeviceMapping),
    stopDeviceMapping: deviceMapping(endpoints.endDeviceMapping),
    sendGpsFixes: (gpsFixes: any) => request(
      endpoints.gpsFixes(),
      { method: HttpMethods.POST, body: gpsFixes },
    ),
    createEvent: (token: string, body: CreateEventBody) => dataRequest(
      endpoints.createEvent(),
      {
        body,
        method: HttpMethods.POST,
        bodyType: 'x-www-form-urlencoded',
        signer: tokenSigner(token),
      },
    ) as Promise<CreateEventResponseData>,
    addRaceColumns: (token: string, regattaName: string, data?: AddRaceColumnsBody) => dataRequest(
      endpoints.addRaceColumns({ urlParams: data, pathParams: [regattaName] }),
      {
        method: HttpMethods.POST,
        signer: tokenSigner(token),
      },
    ) as Promise<AddRaceColumnResponseData[]>,
    startTracking: (token: string, leaderboardName: string, data: StartTrackingBody) => dataRequest(
      endpoints.startTracking({ pathParams: [leaderboardName], urlParams: data }),
      {
        method: HttpMethods.POST,
        signer: tokenSigner(token),
      },
    ),
    stopTracking: (token: string, leaderboardName: string, data?: StopTrackingBody) => dataRequest(
      endpoints.stopTracking({ pathParams: [leaderboardName], urlParams: data }),
      {
        method: HttpMethods.POST,
        signer: tokenSigner(token),
      },
    ),
    setTrackingTimes: (token: string, leaderboardName: string, data: SetTrackingTimesBody) => dataRequest(
      endpoints.setTrackingTimes({ pathParams: [leaderboardName], urlParams: data }),
      {
        method: HttpMethods.POST,
        signer: tokenSigner(token),
      },
    ),
    createAndAddCompetitor: (token: string, regattaName: string, data?: CompetitorBody) => dataRequest(
      endpoints.createAndAddCompetitor({ pathParams: [regattaName], urlParams: data }),
      { method: HttpMethods.POST, signer: tokenSigner(token) },
    ) as Promise<CompetitorResponseData>,
    sendWindFix: (
      token: string,
      regattaName: string,
      raceName: string,
      windFix: WindBodyData,
      sourceId: string,
      sourceType: string = 'WEB',
    ) => request(
      endpoints.putWind(),
      {
        method: HttpMethods.PUT,
        signer: tokenSigner(token),
        body: {
          windSourceType: sourceType,
          windSourceId: sourceId,
          windData: [windFix],
          regattaNamesAndRaceNames: [{ raceName, regattaName }],
        } as WindBody,
      },
    ),
  }
}
