import { HttpMethods, urlGenerator, UrlOptions } from 'api/config'
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
  }
}
