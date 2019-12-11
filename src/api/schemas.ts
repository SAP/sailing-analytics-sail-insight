import { schema } from 'normalizr'


export const DEFAULT_ENTITY_ID_KEY = 'id'
export const LEADERBOARD_ENTITY_NAME = 'leaderboard'
export const COMPETITOR_ENTITY_NAME = 'competitor'
export const BOAT_ENTITY_NAME = 'boat'
export const MARK_ENTITY_NAME = 'mark'
export const MARK_PROPERTIES_ENTITY_NAME = 'markProperties'
export const EVENT_ENTITY_NAME = 'event'
export const RACE_ENTITY_NAME = 'race'
export const REGATTA_ENTITY_NAME = 'regatta'

export const eventSchema = new schema.Entity(
  EVENT_ENTITY_NAME,
  { },
  { idAttribute: DEFAULT_ENTITY_ID_KEY },
)

export const raceSchema = new schema.Entity(
  RACE_ENTITY_NAME,
  {},
  { idAttribute: DEFAULT_ENTITY_ID_KEY },
)

export const regattaSchema = new schema.Entity(
  REGATTA_ENTITY_NAME,
  { races: [raceSchema] },
  { idAttribute: (entity: any) => entity && (entity.name || entity.regatta) },
)

export const leaderboardSchema = new schema.Entity(
  LEADERBOARD_ENTITY_NAME,
  {},
  { idAttribute: 'name' },
)

export const boatSchema = new schema.Entity(
  BOAT_ENTITY_NAME,
  {},
  { idAttribute: DEFAULT_ENTITY_ID_KEY },
)

export const competitorSchema = new schema.Entity(
  COMPETITOR_ENTITY_NAME,
  { boat: boatSchema },
  { idAttribute: DEFAULT_ENTITY_ID_KEY },
)

export const markSchema = new schema.Entity(
  MARK_ENTITY_NAME,
  {},
  { idAttribute: DEFAULT_ENTITY_ID_KEY })

export const markPropertiesSchema = new schema.Entity(
  MARK_PROPERTIES_ENTITY_NAME,
  {},
  { idAttribute: DEFAULT_ENTITY_ID_KEY },
)
