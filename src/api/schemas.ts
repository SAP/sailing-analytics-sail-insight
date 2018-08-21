import { schema } from 'normalizr'


export const DEFAULT_ENTITY_ID_KEY = 'id'
export const LEADERBOARD_ENTITY_NAME = 'leaderboard'
export const COMPETITOR_ENTITY_NAME = 'competitor'
export const BOAT_ENTITY_NAME = 'boat'
export const MARK_ENTITY_NAME = 'mark'
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

export const competitorSchema = new schema.Entity(
  COMPETITOR_ENTITY_NAME,
  {},
  { idAttribute: DEFAULT_ENTITY_ID_KEY },
)

export const markSchema = new schema.Entity(
  MARK_ENTITY_NAME,
  {},
  { idAttribute: DEFAULT_ENTITY_ID_KEY },
)

export const boatSchema = new schema.Entity(
  BOAT_ENTITY_NAME,
  {},
  { idAttribute: DEFAULT_ENTITY_ID_KEY },
)
