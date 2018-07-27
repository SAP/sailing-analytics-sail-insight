import { schema } from 'normalizr'


export const DEFAULT_ENTITY_ID_KEY = 'id'
export const LEADERBOARD_ENTITY_NAME = 'leaderboard'
export const EVENT_ENTITY_NAME = 'event'

export const eventSchema = new schema.Entity(
  EVENT_ENTITY_NAME,
  { },
  { idAttribute: DEFAULT_ENTITY_ID_KEY },
)

export const leaderboardSchema = new schema.Entity(
  LEADERBOARD_ENTITY_NAME,
  {},
  { idAttribute: 'name' },
)
