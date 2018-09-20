import { Alert } from 'react-native'

import { DispatchType } from 'helpers/types'
import I18n from 'i18n'
import { checkIn, fetchCheckIn } from './checkIn'


export const insertTestCheckIns = () => async (dispatch: DispatchType) => {
  // tslint:disable-next-line
  const testUrl1 = 'https://d-labs.sapsailing.com/tracking/checkin?event_id=2779a422-63e8-492c-a648-7c17bffa64f4&leaderboard_name=Havel+Massenstart&competitor_id=5d57168f-6f62-4551-8312-d13ab5f2eb83'
  // tslint:disable-next-line
  const testUrl2 = 'https://d-labs.sapsailing.com/tracking/checkin?event_id=2779a422-63e8-492c-a648-7c17bffa64f4&leaderboard_name=Havel+Massenstart+2&competitor_id=5d57168f-6f62-4551-8312-d13ab5f2eb83'
  // tslint:disable-next-line
  const testUrl3 = 'https://d-labs.sapsailing.com/tracking/checkin?event_id=2779a422-63e8-492c-a648-7c17bffa64f4&leaderboard_name=Havel-Massenstart-03&competitor_id=3947cddd-f52b-43b2-9390-cd54b9eb9f12'
  // tslint:disable-next-line
  const testUrl4 = 'https://dev.sapsailing.com/tracking/checkin?event_id=3c9ddca7-d5e4-4c24-8e31-49747efc9972&leaderboard_name=Dorians+Havelregatta+01&competitor_id=9141957d-3e53-4512-9a9b-5f52c9233900'
  // tslint:disable-next-line
  const testUrl5 = 'https://dev.sapsailing.com/tracking/checkin?event_id=cc6b60c9-ab0f-4664-bfd4-22342ff6210c&leaderboard_name=D-Labs+Test+Laser&competitor_id=ca548a34-889b-40ad-9685-1f6a856ccd9d'

  // dispatch(checkIn(testUrl1))
  // dispatch(checkIn(testUrl2))
  // dispatch(checkIn(testUrl3))
  dispatch(checkIn(await dispatch(fetchCheckIn(testUrl4))))
  dispatch(checkIn(await dispatch(fetchCheckIn(testUrl5))))
}


export const showTestCheckInAlert = () => (dispatch: DispatchType) => {
  Alert.alert(
    'Debug: Test check-ins',
    'Insert test check-ins?',
    [
      { text: I18n.t('caption_cancel'), style: 'cancel' },
      {
        text: I18n.t('caption_ok'), onPress: async () => {
          try {
            await dispatch(insertTestCheckIns())
          } catch (err) {
            Alert.alert(err)
          }
        },
      },
    ],
    { cancelable: true },
  )
}
