import { LEADERBOARD_ENTITY_NAME } from 'api/schemas'
import { getEntityArrayByType, getEntityById, getEntities } from './entity'


export const getLeaderboardEntity = state => getEntities(state, LEADERBOARD_ENTITY_NAME)
export const getLeaderboards = state => getEntityArrayByType(state, LEADERBOARD_ENTITY_NAME)
export const getLeaderboard = name => state => getEntityById(state, LEADERBOARD_ENTITY_NAME, name)
