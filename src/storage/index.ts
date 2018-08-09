import Logger from 'helpers/Logger'
import { GPSFix } from 'models'
import realm from './realm'
import { GPS_FIX_REQUEST_SCHEMA_NAME } from './schemas'


export const writeGPSFixRequest = (url: string, gpsFix: GPSFix) => {
  try {
    realm.write(() => {
      realm.create(
        GPS_FIX_REQUEST_SCHEMA_NAME,
        {
          url,
          gpsFix,
        },
      )
    })
  } catch (e) {
    Logger.debug('Error on creation', e)
  }
}
