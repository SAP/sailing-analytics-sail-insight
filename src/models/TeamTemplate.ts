export const ApiBodyKeys = {
  Name: 'name',
  Nationality: 'nationality',
  BoatName: 'boatName',
  SailNumber: 'sailNumber',
  BoatClass: 'boatClass',
  SailColor: 'sailColor',
  IsDefault: 'isDefault',
  ImageUrl: 'imageUrl',
  Id: 'id',
  HandicapType: 'handicapType',
  HandicapValue: 'handicapValue',
}

export const mapResToTeamTemplate = (map: any) => map && ({
  name: map[ApiBodyKeys.Name],
  nationality: map[ApiBodyKeys.Nationality],
  boatName: map[ApiBodyKeys.BoatName],
  sailNumber: map[ApiBodyKeys.SailNumber],
  boatClass: map[ApiBodyKeys.BoatClass],
  sailColor: map[ApiBodyKeys.SailColor],
  isDefault: map[ApiBodyKeys.IsDefault],
  imageUrl: map[ApiBodyKeys.ImageUrl],
  id: map[ApiBodyKeys.Id],
  handicapType: map[ApiBodyKeys.HandicapType],
  handicapValue: map[ApiBodyKeys.HandicapValue],
} as TeamTemplate)

export enum HandicapTypes {
  Yardstick = 'YARDSTICK',
  TimeOnTime = 'TIME_ON_TIME',
}

export default interface TeamTemplate {
  name: string,
  nationality: string,
  boatName?: string,
  sailNumber: string
  boatClass: string
  sailColor?: string
  imageUrl?: string
  lastUsed?: number
  id?: string
  handicapType?: string
  handicapValue?: number
}

