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
  Handicap: 'handicap',
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
  handicap: map[ApiBodyKeys.Handicap],
} as TeamTemplate)

export enum HandicapTypes {
  Yardstick = 'YARDSTICK',
  TimeOnTime = 'TIME_ON_TIME',
}

export interface Handicap {
  handicapType?: string
  handicapValue?: number
}

export const getDefaultHandicapType = () => HandicapTypes.Yardstick
export const getDefaultHandicap = () => ({
  handicapType: getDefaultHandicapType(),
} as Handicap)

export const hasHandicapChanged = (oldHandicap?: Handicap, newHandicap?: Handicap) =>
  (!oldHandicap && newHandicap) ||
  (oldHandicap && !newHandicap) ||
  (oldHandicap && newHandicap &&
    (newHandicap.handicapValue !== oldHandicap.handicapValue ||
      (newHandicap.handicapValue !== undefined &&
        newHandicap.handicapType !== oldHandicap.handicapType)))


export default interface TeamTemplate {
  name: string,
  nationality?: string,
  boatName?: string,
  sailNumber: string
  boatClass: string
  sailColor?: string
  imageData?: any
  imageUuid?: string
  lastUsed?: number
  id?: string
  handicap?: Handicap
}

