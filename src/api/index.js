import querystring from 'query-string'

import { listRequest, request } from './handler'


const Endpoints = {
  regatta: '/regattas',
  leaderboards: '/leaderboards',
  startDeviceMapping: '/leaderboards/{0}/device_mappings/start',
  endDeviceMapping: '/leaderboards/{0}/device_mappings/end',
}


export const requestRegattas = () => listRequest(Endpoints.regatta)

export const requestLeaderboards = () => listRequest(Endpoints.leaderboards)

const deviceMapping = url => (leaderboardName, data) => request(
  url.format(querystring.encode(leaderboardName)),
  { method: 'POST', body: data },
)

export const startDeviceMapping = deviceMapping(Endpoints.startDeviceMapping)

export const stopDeviceMapping = deviceMapping(Endpoints.stopDeviceMapping)
