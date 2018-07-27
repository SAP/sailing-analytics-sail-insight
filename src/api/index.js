import querystring from 'query-string'

import { listRequest, request, dataRequest } from './handler'
import { leaderboardSchema, eventSchema } from './schemas'


const Endpoints = {
  regatta: '/regattas',
  leaderboards: '/leaderboards',
  events: '/events',
  startDeviceMapping: '/leaderboards/{0}/device_mappings/start',
  endDeviceMapping: '/leaderboards/{0}/device_mappings/end',
}


export const requestRegattas = () => listRequest(Endpoints.regatta)

export const requestLeaderboards = () => listRequest(Endpoints.leaderboards, undefined, leaderboardSchema)
export const requestLeaderboard = leaderboardName => dataRequest(
  `${Endpoints.leaderboards}/${escape(leaderboardName)}`,
  undefined,
  leaderboardSchema,
)

export const requestEvent = eventId => dataRequest(`${Endpoints.events}/${eventId}`, undefined, eventSchema)

const deviceMapping = url => (leaderboardName, data) => request(
  url.format(escape(leaderboardName)),
  { method: 'POST', body: data },
)
export const startDeviceMapping = deviceMapping(Endpoints.startDeviceMapping)
export const stopDeviceMapping = deviceMapping(Endpoints.stopDeviceMapping)
