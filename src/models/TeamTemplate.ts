export const ApiBodyKeys = {
  TeamName: 'teamName',
  Nationality: 'nationality',
  Name: 'name',
  SailNumber: 'sailNumber',
  BoatClass: 'boatClass',
  SailColor: 'sailColor',
  IsDefault: 'isDefault',
  ImageUrl: 'imageUrl',
  Id: 'id',
}

export const mapResToTeamTemplate = (map: any) => map && ({
  teamName: map[ApiBodyKeys.TeamName],
  nationality: map[ApiBodyKeys.Nationality],
  name: map[ApiBodyKeys.Name],
  sailNumber: map[ApiBodyKeys.SailNumber],
  boatClass: map[ApiBodyKeys.BoatClass],
  sailColor: map[ApiBodyKeys.SailColor],
  isDefault: map[ApiBodyKeys.IsDefault],
  imageUrl: map[ApiBodyKeys.ImageUrl],
  id: map[ApiBodyKeys.Id],
} as TeamTemplate)

export default interface TeamTemplate {
  teamName: string,
  nationality: string,
  name?: string,
  sailNumber: string
  boatClass: string
  sailColor?: string
  imageUrl?: string
  lastUsed?: number
  id?: string
}

