export const ApiBodyKeys = {
  Name: 'name',
  ShortName: 'shortName',
  Id: 'id',
  SailId: 'sailID',
  Nationality: 'nationality',
  CountryCode: 'countryCode',
  Rank: 'rank',
  CarriedPoints: 'carriedPoints',
  NetPoints: 'netPoints',
  RaceScores: 'raceScores',
}

export default class Competitor {
  public static createInstance(map?: any) {
    if (!map) {
      return undefined
    }
    const newInstance = new Competitor()
    newInstance.name = map[ApiBodyKeys.Name]
    newInstance.shortName = map[ApiBodyKeys.ShortName]
    newInstance.id = map[ApiBodyKeys.Id]
    newInstance.sailId = map[ApiBodyKeys.SailId]
    newInstance.nationality = map[ApiBodyKeys.Nationality]
    newInstance.countryCode = map[ApiBodyKeys.CountryCode]
    newInstance.rank = map[ApiBodyKeys.Rank]
    newInstance.carriedPoints = map[ApiBodyKeys.CarriedPoints]
    newInstance.netPoints = map[ApiBodyKeys.NetPoints]
    newInstance.raceScores = map[ApiBodyKeys.RaceScores]
    return newInstance
  }

  public name?: string
  public shortName?: string
  public id?: string
  public sailId?: string
  public nationality?: string
  public countryCode?: string
  public rank?: number
  public carriedPoints?: any
  public netPoints?: string[]
  public raceScores?: any
}
