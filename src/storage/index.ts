import Logger from 'helpers/Logger'
import { PositionFix } from 'models'
import realm from './realm'
import {
  BASE_URL_PROPERTY_NAME,
  GPS_FIX_PROPERTY_NAME,
  GPS_FIX_REQUEST_DUPLICATE_SCHEMA_NAME,
  GPS_FIX_REQUEST_SCHEMA_NAME,
} from './schemas'


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

export const writeGPSFixRequest = (url: string, gpsFix: PositionFix) => {
  try {
    realm.write(() => {
      realm.create(
        GPS_FIX_REQUEST_SCHEMA_NAME,
        {
          [BASE_URL_PROPERTY_NAME]: url,
          [GPS_FIX_PROPERTY_NAME]: gpsFix,
        },
      )
    })

    writeGPSFixRequestDuplicate(url, gpsFix)
  } catch (e) {
    Logger.debug('Error on gpsfix creation', e)
  }
}

export const writeGPSFixRequestDuplicate = (url: string, gpsFix: PositionFix) => {
  try {
    realm.write(() => {
      realm.create(
        GPS_FIX_REQUEST_DUPLICATE_SCHEMA_NAME,
        {
          [BASE_URL_PROPERTY_NAME]: url,
          [GPS_FIX_PROPERTY_NAME]: gpsFix,
        },
      )
    })
  } catch (e) {
    Logger.debug('Error on gpsfix creation', e)
  }
}

export const readGPSFixRequests = read(GPS_FIX_REQUEST_SCHEMA_NAME)

export const readGPSFixRequestDuplicates = read(GPS_FIX_REQUEST_DUPLICATE_SCHEMA_NAME)

export const deleteGPSFixRequests = (fixes: any) => {
  try {
    realm.write(() => {
      realm.delete(fixes)
    })
  } catch (e) {
    Logger.debug('Error on gpsfix deletion', e)
  }
}

export const deleteAllGPSFixRequests = () => {
  try {
    realm.write(() => {
      realm.deleteAll()
    })
  } catch (e) {
    Logger.debug('Error on clear gpsfix storage', e)
  }
}
