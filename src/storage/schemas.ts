import Realm from 'realm'


export const BASE_URL_PROPERTY_NAME = 'baseUrl'


export const GPS_FIX_SCHEMA_NAME = 'GPSFix'
export const GPS_FIX_REQUEST_SCHEMA_NAME = 'GPSFixRequest'

export const GPS_SCHEMA: Realm.ObjectSchema = {
  name: GPS_FIX_SCHEMA_NAME,
  properties: {
    latitude: 'double',
    longitude: 'double',
    timeMillis: 'double',
    speedInKnots: 'double?',
    bearingInDeg: 'double?',
  },
}

export const GPS_REQUEST_SCHEMA: Realm.ObjectSchema = {
  name: GPS_FIX_REQUEST_SCHEMA_NAME,
  properties: {
    [BASE_URL_PROPERTY_NAME]: 'string',
    gpsFix: { type: GPS_FIX_SCHEMA_NAME },
  },
}
