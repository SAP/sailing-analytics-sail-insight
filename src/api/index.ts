import format from 'string-format'

import { dataRequest, listRequest, request } from './handler'
import {
  boatSchema, competitorSchema, eventSchema, leaderboardSchema, markSchema, raceSchema, regattaSchema,
} from './schemas'


const ApiSuffix = '/sailingserver/api/v1'

const getUrl = (apiRoot: string, path: string) => `${apiRoot}${ApiSuffix}${path}`

const apiEndpoints = (serverUrl: string) => ({
  regatta: getUrl(serverUrl, '/regattas'),
  regattaRaces: getUrl(serverUrl, '/regattas/{0}/races'),
  regattaRaceTimes: getUrl(serverUrl, '/regattas/{0}/races/{1}/times'),
  leaderboards: getUrl(serverUrl, '/leaderboards'),
  boats: getUrl(serverUrl, '/boats'),
  events: getUrl(serverUrl, '/events'),
  gpsFixes: getUrl(serverUrl, '/gps_fixes'),
  competitors: getUrl(serverUrl, '/competitors'),
  marks: getUrl(serverUrl, '/leaderboards/{0}/marks'),
  startDeviceMapping: getUrl(serverUrl, '/leaderboards/{0}/device_mappings/start'),
  endDeviceMapping: getUrl(serverUrl, '/leaderboards/{0}/device_mappings/end'),
})

const deviceMapping = (path: string) => (leaderboardName: string, data: any) => request(
  format(path, escape(leaderboardName)),
  { method: 'POST', body: data },
)


export default (serverUrl: string) => {
  const endpoints = apiEndpoints(serverUrl)
  return {
    requestRegattas: () => listRequest(endpoints.regatta),
    requestRegatta: (regattaName: string) => dataRequest(
      `${endpoints.regatta}/${regattaName}`,
      { dataSchema: regattaSchema },
    ),
    requestRaces: (regattaName: string) => dataRequest(
      format(endpoints.regattaRaces, regattaName),
      { dataSchema: regattaSchema },
    ),
    requestRace: (regattaName: string, raceName: string, raceId?: string) => dataRequest(
      format(endpoints.regattaRaceTimes, regattaName, raceName),
      {
        dataSchema: raceSchema,
        processData: raceId ? ((data: any) => data && { ...data, id: raceId }) : undefined,
      },
    ),
    requestLeaderboards: () => listRequest(endpoints.leaderboards, { dataSchema: leaderboardSchema }),
    requestLeaderboard: (leaderboardName: string) => dataRequest(
      `${endpoints.leaderboards}/${escape(leaderboardName)}`,
      { dataSchema: leaderboardSchema },
    ),
    requestEvent: (eventId: string) => dataRequest(`${endpoints.events}/${eventId}`, { dataSchema: eventSchema }),
    requestCompetitor: (competitorId: string) => dataRequest(
      `${endpoints.competitors}/${competitorId}`,
      { dataSchema: competitorSchema },
    ),
    requestMark: (leaderboardName: string, id: string) => dataRequest(
      `${format(endpoints.marks, leaderboardName)}/${id}`,
      { dataSchema: markSchema },
    ),
    requestBoat: (id: string) => dataRequest(
      `${endpoints.boats}/${id}`,
      { dataSchema: boatSchema },
    ),
    startDeviceMapping: deviceMapping(endpoints.startDeviceMapping),
    stopDeviceMapping: deviceMapping(endpoints.endDeviceMapping),
    sendGpsFixes: (gpsFixes: any) => request(
      endpoints.gpsFixes,
      { method: 'POST', body: gpsFixes },
    ),
  }
}
