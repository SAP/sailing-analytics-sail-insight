import { LEADERBOARD_ENTITY_NAME } from 'api/schemas'
import { getEntities, getEntityArrayByType, getEntityById } from './entity'


export const getLeaderboardEntity = (state: any) => getEntities(state, LEADERBOARD_ENTITY_NAME)
export const getLeaderboards = (state: any) => getEntityArrayByType(state, LEADERBOARD_ENTITY_NAME)
export const getLeaderboard = (name: string) => (state: any) => getEntityById(state, LEADERBOARD_ENTITY_NAME, name)
