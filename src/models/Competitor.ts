export const ApiBodyKeys = {
  Name: 'name',
  ShortName: 'shortName',
  Id: 'id',
  SailId: 'sailID',
  Nationality: 'nationality',
  CountryCode: 'countryCode',
  NationalityISO2: 'nationalityISO2',
  Rank: 'rank',
  CarriedPoints: 'carriedPoints',
  NetPoints: 'netPoints',
  RaceScores: 'raceScores',
}

export const mapResToCompetitor = (map: any) => map && ({
  name: map[ApiBodyKeys.Name],
  shortName: map[ApiBodyKeys.ShortName],
  id: map[ApiBodyKeys.Id],
  sailId: map[ApiBodyKeys.SailId],
  nationality: map[ApiBodyKeys.Nationality],
  countryCode: map[ApiBodyKeys.NationalityISO2] || map[ApiBodyKeys.CountryCode],
  rank: map[ApiBodyKeys.Rank],
  carriedPoints: map[ApiBodyKeys.CarriedPoints],
  netPoints: map[ApiBodyKeys.NetPoints],
  raceScores: map[ApiBodyKeys.RaceScores],
} as Competitor)


export default interface Competitor {
  name?: string
  shortName?: string
  id?: string
  sailId?: string
  nationality?: string
  countryCode?: string
  rank?: number
  carriedPoints?: any
  netPoints?: string[]
  raceScores?: any
}
