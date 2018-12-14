export const ApiBodyKeys = {
  Name: 'name',
  SailNumber: 'sailNumber',
  BoatClass: 'boatClass',
  SailColor: 'sailColor',
  IsDefault: 'isDefault',
  ImageUrl: 'imageUrl',
  Id: 'id',
}

export const mapResToBoatTemplate = (map: any) => map && ({
  name: map[ApiBodyKeys.Name],
  sailNumber: map[ApiBodyKeys.SailNumber],
  boatClass: map[ApiBodyKeys.BoatClass],
  sailColor: map[ApiBodyKeys.SailColor],
  isDefault: map[ApiBodyKeys.IsDefault],
  imageUrl: map[ApiBodyKeys.ImageUrl],
  id: map[ApiBodyKeys.Id],
} as BoatTemplate)

export default interface BoatTemplate {
  name: string,
  sailNumber: string
  boatClass: string
  sailColor?: string
  imageUrl?: string
  lastUsed?: number
  id?: string
}

