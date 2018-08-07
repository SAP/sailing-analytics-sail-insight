import Realm from 'realm'

export const GPS_SCHEMA: Realm.ObjectSchema = {
  name: 'GPSFix',
  properties: {
    latitude: 'number',
    longitude: 'number',
    timeMillis: 'number',
    speedInKnots: 'number?',
    bearingInDeg: 'number?',
  },
}
