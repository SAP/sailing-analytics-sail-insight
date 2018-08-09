import Realm from 'realm'


export const GPS_FIX_SCHEMA_NAME = 'GPSFix'
export const GPS_FIX_REQUEST_SCHEMA_NAME = 'GPSFixRequest'

export const GPS_SCHEMA: Realm.ObjectSchema = {
  name: GPS_FIX_SCHEMA_NAME,
  properties: {
    latitude: 'number',
    longitude: 'number',
    timeMillis: 'number',
    speedInKnots: 'number?',
    bearingInDeg: 'number?',
  },
}

export const GPS_REQUEST_SCHEMA: Realm.ObjectSchema = {
  name: GPS_FIX_REQUEST_SCHEMA_NAME,
  properties: {
    url: 'string',
    gpsFix: { type: GPS_FIX_SCHEMA_NAME },
  },
}
