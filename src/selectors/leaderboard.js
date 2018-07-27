import { LEADERBOARD_ENTITY_NAME } from 'api/schemas'
import { getEntityArrayByType, getEntityById } from './entity'


export const getLeaderbaords = state => getEntityArrayByType(state, LEADERBOARD_ENTITY_NAME)

export const getLeaderboard = (state, id) => getEntityById(state, LEADERBOARD_ENTITY_NAME, id)
