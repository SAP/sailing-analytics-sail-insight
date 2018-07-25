import { listRequest } from './handler'


const Endpoints = {
  regatta: '/regatta',
  leaderboards: '/leaderboards',
}


export const requestRegattas = () => listRequest(Endpoints.regatta)

export const requestLeaderboards = () => listRequest(Endpoints.leaderboards)
