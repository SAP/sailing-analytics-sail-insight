import format from 'string-format'

import { dataRequest, listRequest, request } from './handler'
import {
  boatSchema, competitorSchema, eventSchema, leaderboardSchema, markSchema,
} from './schemas'


const ApiSuffix = '/sailingserver/api/v1'

const getUrl = (apiRoot: string, path: string) => `${apiRoot}${ApiSuffix}${path}`

const apiEndpoints = (serverUrl: string) => ({
  regatta: getUrl(serverUrl, '/regattas'),
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
    requestLeaderboards: () => listRequest(endpoints.leaderboards, undefined, leaderboardSchema),
    requestLeaderboard: (leaderboardName: string) => dataRequest(
      `${endpoints.leaderboards}/${escape(leaderboardName)}`,
      undefined,
      leaderboardSchema,
    ),
    requestEvent: (eventId: string) => dataRequest(`${endpoints.events}/${eventId}`, undefined, eventSchema),
    requestCompetitor: (competitorId: string) => dataRequest(
      `${endpoints.competitors}/${competitorId}`,
      undefined,
      competitorSchema,
    ),
    requestMark: (leaderboardName: string, id: string) => dataRequest(
      `${format(endpoints.marks, leaderboardName)}/${id}`,
      undefined,
      markSchema,
    ),
    requestBoat: (id: string) => dataRequest(
      `${endpoints.boats}/${id}`,
      undefined,
      boatSchema,
    ),
    startDeviceMapping: deviceMapping(endpoints.startDeviceMapping),
    stopDeviceMapping: deviceMapping(endpoints.endDeviceMapping),
    sendGpsFixes: (gpsFixes: any) => request(
      endpoints.gpsFixes,
      { method: 'POST', body: gpsFixes },
    ),
  }
}
