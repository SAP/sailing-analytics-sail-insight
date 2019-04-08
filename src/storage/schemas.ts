import Realm from 'realm'

import { PersistanceSchema } from 'models/PositionFix'


export const BASE_URL_PROPERTY_NAME = 'baseUrl'
export const GPS_FIX_PROPERTY_NAME = 'gpsFix'


export const GPS_FIX_SCHEMA_NAME = 'GPSFix'
export const GPS_FIX_REQUEST_SCHEMA_NAME = 'GPSFixRequest'

export const GPS_SCHEMA: Realm.ObjectSchema = {
  name: GPS_FIX_SCHEMA_NAME,
  properties: PersistanceSchema,
}

export const GPS_REQUEST_SCHEMA: Realm.ObjectSchema = {
  name: GPS_FIX_REQUEST_SCHEMA_NAME,
  properties: {
    [BASE_URL_PROPERTY_NAME]: 'string',
    [GPS_FIX_PROPERTY_NAME]: { type: GPS_FIX_SCHEMA_NAME },
  },
}
