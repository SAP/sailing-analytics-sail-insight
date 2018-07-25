import { listRequest } from './handler'


const Endpoints = {
  regatta: '/regattas',
  leaderboards: '/leaderboards',
}


export const requestRegattas = () => listRequest(Endpoints.regatta)

export const requestLeaderboards = () => listRequest(Endpoints.leaderboards)
