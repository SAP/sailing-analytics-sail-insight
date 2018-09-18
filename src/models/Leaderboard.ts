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

export default class Leaderboard {
  public static createInstance(map: any) {
    if (!map) {
      return undefined
    }
    const newInstance = new Leaderboard()
    newInstance.name = map[ApiBodyKeys.Name]
    newInstance.displayName = map[ApiBodyKeys.DisplayName]
    newInstance.resultTimepoint = map[ApiBodyKeys.ResultTimepoint]
    newInstance.resultState = map[ApiBodyKeys.ResultState]
    newInstance.type = map[ApiBodyKeys.Type]
    newInstance.canBoatsOfCompetitorsChangePerRace = map[ApiBodyKeys.CanBoatsOfCompetitorsChangePerRace]
    newInstance.maxCompetitorsCount = map[ApiBodyKeys.MaxCompetitorsCount]
    newInstance.scoringComment = map[ApiBodyKeys.ScoringComment]
    newInstance.lastScoringUpdate = map[ApiBodyKeys.LastScoringUpdate]
    newInstance.columnNames = map[ApiBodyKeys.ColumnNames]
    newInstance.competitors = map[ApiBodyKeys.Competitors]
    newInstance.ShardingLeaderboardName = map[ApiBodyKeys.ShardingLeaderboardName]
    return newInstance
  }

  public name?: string
  public displayName?: string
  public resultTimepoint?: string
  public resultState?: string
  public type?: string
  public canBoatsOfCompetitorsChangePerRace?: boolean
  public maxCompetitorsCount?: number
  public scoringComment?: string
  public lastScoringUpdate?: number
  public columnNames?: string[]
  public competitors?: any[]
  public ShardingLeaderboardName?: string
}
