import { compose, not, prop, defaultTo, equals, replace, either, isNil, is, when } from 'ramda'

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

// fails if handicalValue is defined and 0 or Infinity
// replace , with . for float conversion
export const isHandicapValid = (handicap: Handicap) => compose(
  not,
  either(equals(0), equals(Infinity)),
  parseFloat,
  replace(/,/g, '.'),
  when(compose(not, is(String)), toString),
  defaultTo("1"),
  prop('handicapValue'),
  defaultTo({}))
  (handicap)

export const convertHandicapValue = (
  fromType: HandicapTypes,
  toType: HandicapTypes,
  value?: any,
) => {
  if (isNil(value)) {
    return value
  }

  const handicapValueFloat = parseFloat(value.toString().replace(',', '.'))
  if (fromType === HandicapTypes.Yardstick && toType === HandicapTypes.TimeOnTime ||
      fromType === HandicapTypes.TimeOnTime && toType === HandicapTypes.Yardstick) {
    return (+(100 / handicapValueFloat)).toString()
  }

  return value.toString()
}

// values for Yardstick should not have digits
// values for ToT should have 3 digits max
export const isAllowedHandicapValue = (type: HandicapTypes, value?: any) => {
  if (isNil(value)) {
    return true
  }
  const indexDecimal = value.toString().indexOf('.')
  let numberOfDigits = indexDecimal >= 0 ? value.toString().length - 1 - indexDecimal : 0

  const digits = type === HandicapTypes.Yardstick ? 0 : 3
  return numberOfDigits <= digits
}

export const getAllowedHandicapValue = (type: HandicapTypes, value?: any) => {
  if (isNil(value)) {
    return value
  }

  if (isAllowedHandicapValue(type, value)) {
    return value.toString()
  }

  const handicapValueFloat = parseFloat(value)
  if (type === HandicapTypes.Yardstick) {
    return Math.floor(handicapValueFloat).toString()
  } else {
    return (Math.floor(handicapValueFloat * 1000) / 1000).toString()
  }
}

export const getTimeOnTimeFactor = (handicap?: Handicap) => {
  const { handicapType = getDefaultHandicapType(), handicapValue = null } = handicap || {}

  if (!handicapType || !handicapValue) return undefined

  if (handicapType === HandicapTypes.TimeOnTime) return handicapValue

  const timeOnTimeFactor = 100 / handicapValue

  return timeOnTimeFactor
}


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

