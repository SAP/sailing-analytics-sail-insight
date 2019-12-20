import { __,  compose, concat, reduce, toUpper } from 'ramda'
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

const { width: viewportWidth } = Dimensions.get('window')
const wp = (percentage: number) => Math.round((percentage * viewportWidth) / 100)
const qrCodeWidth = wp(80)

const mapStateToProps = (state: any, props: any) => ({
  // Should be selected from the redux store once we know the API
  registrationData: {
    leaderboardName: 'foobar',
    markId: 'foo-bar-baz-123',
  }
})

const trackingQRCode = fromClass(QRCode).contramap((props: any) => ({
  value: JSON.stringify(props.registrationData),
  size: qrCodeWidth
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
