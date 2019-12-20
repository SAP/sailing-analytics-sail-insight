import { __,  compose, concat, reduce, toUpper } from 'ramda'
import querystring from 'query-string'
import QRCode from 'react-native-qrcode-svg'
import { navigateBack } from 'navigation'
import {
  Component,
  fold,
  fromClass,
  nothing,
  reduxConnect as connect
} from 'components/fp/component'
import { text, touchableOpacity, view } from 'components/fp/react-native'
import styles from './styles'
import { Dimensions } from 'react-native'
import { updateMarkConfigurationDeviceTracking } from 'actions/courses'
import { getDeviceId } from 'selectors/user'
import { getSelectedEventInfo } from 'selectors/event'
import { getMarkConfigurationById } from 'selectors/course'
import { BRANCH_APP_DOMAIN } from 'environment'

const { width: viewportWidth } = Dimensions.get('window')
const wp = (percentage: number) => Math.round((percentage * viewportWidth) / 100)
const qrCodeWidth = wp(80)

const mapStateToProps = (state: any, props: any) => {
  const { serverUrl, eventId, leaderboardName, secret } = getSelectedEventInfo(state)
  const { markId } = getMarkConfigurationById(props.selectedMarkConfiguration)(state)

  const path = querystring.stringify({
    event_id: eventId,
    leaderboard_name: leaderboardName,
    secret,
    mark_id: markId
  })
  const checkinUrl = `${serverUrl}/tracking/checkin?${path}`

  return {
    qrCodeLink: `https://${BRANCH_APP_DOMAIN}/invite?checkinUrl=${encodeURIComponent(checkinUrl)}`
  }
}

const trackingQRCode = fromClass(QRCode).contramap((props: any) => ({
  value: props.qrCodeLink,
  size: qrCodeWidth,
  backgroundColor: 'white',
  quietZone: 10
}))

const useThisDeviceButton = Component(props => compose(
  fold(props),
  touchableOpacity({
    onPress: () => {
      props.updateMarkConfigurationDeviceTracking({
        id: props.selectedMarkConfiguration,
        deviceId: getDeviceId()
      })
      navigateBack()
    },
    style: styles.useThisDeviceButton,
  }),
  text({ style: styles.useThisDeviceButtonText }),
  toUpper)(
  'Use this device'))

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps, { updateMarkConfigurationDeviceTracking }),
    view({ style: styles.container }),
    reduce(concat, nothing()))([
    trackingQRCode,
    text({ style: styles.scanText }, 'Scan this QR code with another device or use this device as a tracker'),
    useThisDeviceButton ]))
