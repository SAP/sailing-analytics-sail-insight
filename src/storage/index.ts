import Logger from 'helpers/Logger'
import { GPSFix } from 'models'
import realm from './realm'
import { GPS_FIX_REQUEST_SCHEMA_NAME } from './schemas'


const read = (type: string) => (options?: {
  sortedBy?: string,
}) => {
  let result = realm.objects(type)
  if (!options) {
    return result
  }
  const { sortedBy } = options
  if (sortedBy) {
    result = result.sorted(sortedBy)
  }
  return result
}

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

export const readGPSFixRequests = read(GPS_FIX_REQUEST_SCHEMA_NAME)
