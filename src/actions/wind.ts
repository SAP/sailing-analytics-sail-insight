import { selfTrackingApi } from 'api'
import { WindBodyData } from 'api/endpoints/types'
import { withToken } from 'helpers/actions'
import { getNowAsMillis } from 'helpers/date'
import { DispatchType, GetStateType } from 'helpers/types'
import { getTrackedCheckIn } from 'selectors/checkIn'
import { getLocationStats } from 'selectors/location'

import { updateLastWindCourse, updateLastWindSpeed } from './locations'


export type SendWindAction = (direction: number, speedInKnots: number) => any
export const sendWind: SendWindAction = (direction, speedInKnots) => withToken(
  async (token, dispatch: DispatchType, getState: GetStateType) => {
    const state = getState()
    const checkIn = getTrackedCheckIn(state)
    const locationStats = getLocationStats(state)

    if (
      !checkIn ||
      !checkIn.currentTrackName ||
      !checkIn.regattaName ||
      !locationStats
    ) {
      throw new Error('missing data.')
    }

    await selfTrackingApi.sendWindFix(
      token,
      checkIn.regattaName,
      checkIn.currentTrackName,
      {
        direction,
        speedinknots: speedInKnots,
        position: {
          latitude_deg: locationStats.lastLatitude,
          longitude_deg: locationStats.lastLongitude,
        },
        timepoint: getNowAsMillis(),
      } as WindBodyData,
      'APP',
    )

    dispatch(updateLastWindCourse(direction))
    dispatch(updateLastWindSpeed(speedInKnots))
  })
