import { WindBodyData } from 'api/endpoints/types'
import { withDataApi } from 'helpers/actions'
import { getNowAsMillis } from 'helpers/date'
import { getTrackedCheckIn } from 'selectors/checkIn'
import { getLocationStats } from 'selectors/location'

import { updateLastWindCourse, updateLastWindSpeed } from './locations'


export type SendWindAction = (direction: number, speedInKnots: number) => any
export const sendWind: SendWindAction = (direction, speedInKnots) => withDataApi({ fromTracked: true })(
  async (dataApi, dispatch, getState) => {
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

    await dataApi.sendWindFix(
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
  },
)
