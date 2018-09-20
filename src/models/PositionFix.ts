export const ApiBodyKeys = {
  Fixes: 'fixes',
  Course: 'course',
  Latitude: 'latitude',
  Longitude: 'longitude',
  Speed: 'speed',
  Timestamp: 'timestamp',
  DeviceUUID: 'deviceUuid',
}

export const PositionFix = (map: any) => map && ({
  speedInKnots: map[ApiBodyKeys.Speed],
  bearingInDeg: map[ApiBodyKeys.Course],
  latitude: map[ApiBodyKeys.Latitude],
  longitude: map[ApiBodyKeys.Longitude],
  timeMillis: map[ApiBodyKeys.Timestamp],
} as PositionFix)

export const isPositionFix = (arg: any): arg is PositionFix => {
  return arg.latitude !== undefined
}

export const PersistanceSchema = {
  latitude: 'double',
  longitude: 'double',
  timeMillis: 'double',
  speedInKnots: 'double?',
  bearingInDeg: 'double?',
  accuracy: 'double?',
}

export default interface PositionFix {
  speedInKnots: number | null
  bearingInDeg: number | null
  accuracy?: number
  latitude: number
  longitude: number
  timeMillis: number
}
