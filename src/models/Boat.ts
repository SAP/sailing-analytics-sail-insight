export const ApiBodyKeys = {
  Name: 'name',
  SailNumber: 'sailNumber',
  BoatClass: 'boatClass',
  SailColor: 'sailColor',
  IsDefault: 'isDefault',
  ImageUrl: 'imageUrl',
}

export const mapResToBoat = (map: any) => map && ({
  name: map[ApiBodyKeys.Name],
  sailNumber: map[ApiBodyKeys.SailNumber],
  boatClass: map[ApiBodyKeys.BoatClass],
  sailColor: map[ApiBodyKeys.SailColor],
  isDefault: map[ApiBodyKeys.IsDefault],
  imageUrl: map[ApiBodyKeys.ImageUrl],
} as Boat)


export default interface Boat {
  name?: string,
  sailNumber?: string
  boatClass?: string
  sailColor?: string
  isDefault?: boolean
  imageUrl?: string
}

