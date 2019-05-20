export const ApiBodyKeys = {
  Name: 'name',
  DisplayName: 'displayName',
  ResultTimepoint: 'resultTimepoint',
  ResultState: 'resultState',
  Type: 'type',
  CanBoatsOfCompetitorsChangePerRace: 'canBoatsOfCompetitorsChangePerRace',
  MaxCompetitorsCount: 'maxCompetitorsCount',
  ScoringComment: 'scoringComment',
  LastScoringUpdate: 'lastScoringUpdate',
  ColumnNames: 'columnNames',
  Competitors: 'competitors',
  ShardingLeaderboardName: 'ShardingLeaderboardName',
}

export const mapResToLeaderboard = (map: any) => map && ({
  name : map[ApiBodyKeys.Name],
  displayName : map[ApiBodyKeys.DisplayName],
  resultTimepoint : map[ApiBodyKeys.ResultTimepoint],
  resultState : map[ApiBodyKeys.ResultState],
  type : map[ApiBodyKeys.Type],
  canBoatsOfCompetitorsChangePerRace : map[ApiBodyKeys.CanBoatsOfCompetitorsChangePerRace],
  maxCompetitorsCount : map[ApiBodyKeys.MaxCompetitorsCount],
  scoringComment : map[ApiBodyKeys.ScoringComment],
  lastScoringUpdate : map[ApiBodyKeys.LastScoringUpdate],
  columnNames : map[ApiBodyKeys.ColumnNames],
  competitors : map[ApiBodyKeys.Competitors],
  ShardingLeaderboardName : map[ApiBodyKeys.ShardingLeaderboardName],
} as Leaderboard)


export interface Leaderboard {
  name?: string
  displayName?: string
  resultTimepoint?: string
  resultState?: string
  type?: string
  canBoatsOfCompetitorsChangePerRace?: boolean
  maxCompetitorsCount?: number
  scoringComment?: string
  lastScoringUpdate?: number
  columnNames?: string[]
  competitors?: LeaderboardCompetitor[]
  ShardingLeaderboardName?: string
}

export interface LeaderboardBoat {
  name?: string
  displayName?: string
  id?: string
  sailId?: string
  boatClass?: string
  color?: string
}

export interface LeaderboardCompetitor {
  name?: string
  shortName?: string
  displayName?: string
  id?: string
  sailID?: string
  nationality?: string
  countryCode?: string
  boat?: LeaderboardBoat
  rank?: number
  carriedPoints?: number
  netPoints?: number
  overallRank?: number
  columns?: Map<string, LeaderboardColumn>
}

export interface LeaderboardColumn {
  boat?: LeaderboardBoat
  fleet?: string
  totalPoints?: number
  uncorrectedTotalPoints?: number
  netPoints?: number
  maxPointsReason?: string
  isDiscarded?: boolean
  isCorrected?: boolean
  rank?: number
  trackedRank?: number
  finished?: boolean
  data?: any
}

export const ColumnDataApiBodyKeys = {
  gapToLeaderInS: 'gapToLeader-s',
  averageSpeedOverGround: 'averageSpeedOverGround-kts',
  distanceTravelled: 'distanceTraveled-m',
  timeTravelled: 'timeTraveled-s',
  currentSpeedOverGround: 'currentSpeedOverGround-kts',
  gapToLeaderInM: 'gapToLeader-m',
  numberOfManeuvers: 'numberOfManeuvers',
  currentLeg: 'currentLeg',
}

export const mapResToLeaderboardColumnData = (map: any) => map && ({
  gapToLeaderInS: map[ColumnDataApiBodyKeys.gapToLeaderInS],
  averageSpeedOverGround: map[ColumnDataApiBodyKeys.averageSpeedOverGround],
  distanceTravelled: map[ColumnDataApiBodyKeys.distanceTravelled],
  timeTravelled: map[ColumnDataApiBodyKeys.timeTravelled],
  currentSpeedOverGround: map[ColumnDataApiBodyKeys.currentSpeedOverGround],
  gapToLeaderInM: map[ColumnDataApiBodyKeys.gapToLeaderInM],
  numberOfManeuvers: map[ColumnDataApiBodyKeys.numberOfManeuvers],
  currentLeg: map[ColumnDataApiBodyKeys.currentLeg],
} as LeaderboardColumnData)

export interface LeaderboardColumnData {
  gapToLeaderInS?: number
  averageSpeedOverGround?: number
  distanceTravelled?: number
  timeTravelled?: number
  currentSpeedOverGround?: number
  gapToLeaderInM?: number
  numberOfManeuvers?: number
  currentLeg?: number
}

export interface LeaderboardCompetitorCurrentTrack extends LeaderboardCompetitor {
  gain?: boolean
  trackedColumn?: LeaderboardColumn
  trackedColumnData?: LeaderboardColumnData
}
