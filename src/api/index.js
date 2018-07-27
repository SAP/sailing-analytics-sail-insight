import format from 'string-format'

import { listRequest, request, dataRequest } from './handler'
import {
  leaderboardSchema, eventSchema, competitorSchema, boatSchema, markSchema,
} from './schemas'


const Endpoints = {
  regatta: '/regattas',
  leaderboards: '/leaderboards',
  boats: '/boats',
  events: '/events',
  competitors: '/competitors',
  marks: '/leaderboards/{0}/marks',
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

export const requestCompetitor = competitorId => dataRequest(
  `${Endpoints.competitors}/${competitorId}`,
  undefined,
  competitorSchema,
)

export const requestMark = (leaderboardName, id) => dataRequest(
  `${format(Endpoints.marks, leaderboardName)}/${id}`,
  undefined,
  markSchema,
)

export const requestBoat = id => dataRequest(
  `${Endpoints.boats}/${id}`,
  undefined,
  boatSchema,
)

const deviceMapping = url => (leaderboardName, data) => request(
  format(url, escape(leaderboardName)),
  { method: 'POST', body: data },
)
export const startDeviceMapping = deviceMapping(Endpoints.startDeviceMapping)
export const stopDeviceMapping = deviceMapping(Endpoints.stopDeviceMapping)
