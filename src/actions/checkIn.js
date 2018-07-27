import CheckInService from 'services/CheckInService'
import { fetchEvent } from './events'
import { fetchLeaderboard } from './leaderboards'


export const collectCheckInData = checkInData => async (dispatch) => {
  if (!checkInData) {
    return
  }
  console.log('FETCH')
  await dispatch(fetchEvent(checkInData.eventId))
  await dispatch(fetchLeaderboard(checkInData.leaderboardName))
}

export const checkIn = url => async (dispatch) => {
  const data = CheckInService.extractData(url)
  console.log(data)
  dispatch(collectCheckInData(data))
}
