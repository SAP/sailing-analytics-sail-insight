export const ApiBodyKeys = {
  Name: 'name',
  Nationality: 'nationality',
  BoatName: 'boatName',
  SailNumber: 'sailNumber',
  BoatClass: 'boatClass',
  SailColor: 'sailColor',
  IsDefault: 'isDefault',
  ImageData: 'imageData',
  ImageUuid: 'imageUuid',
  Id: 'id',
}

export const mapResToTeamTemplate = (map: any) => map && ({
  name: map[ApiBodyKeys.Name],
  nationality: map[ApiBodyKeys.Nationality],
  boatName: map[ApiBodyKeys.BoatName],
  sailNumber: map[ApiBodyKeys.SailNumber],
  boatClass: map[ApiBodyKeys.BoatClass],
  sailColor: map[ApiBodyKeys.SailColor],
  isDefault: map[ApiBodyKeys.IsDefault],
  imageData: map[ApiBodyKeys.ImageData],
  imageUuid: map[ApiBodyKeys.ImageUuid],
  id: map[ApiBodyKeys.Id],
} as TeamTemplate)

export default interface TeamTemplate {
  name: string,
  nationality: string,
  boatName?: string,
  sailNumber: string
  boatClass: string
  sailColor?: string
  imageData?: any
  imageUuid?: string
  lastUsed?: number
  id?: string
}

