import CheckInService from 'services/CheckInService'

export const checkIn = data => async (_, getState) => {
  CheckInService.extractData(data)
}
