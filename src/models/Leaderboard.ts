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


export default interface Leaderboard {
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
  competitors?: any[]
  ShardingLeaderboardName?: string
}

