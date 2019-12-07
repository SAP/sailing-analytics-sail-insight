import { __,  compose, concat,  reduce } from 'ramda'
import QRCode from 'react-native-qrcode-svg'

import {
  Component,
  fold,
  fromClass,
  nothing,
  reduxConnect as connect
} from 'components/fp/component'
import { text } from 'components/fp/react-native'

const mapStateToProps = (state: any, props: any) => ({
  // Should be selected from the redux store once we know the API
  registrationData: {
    leaderboardName: 'foobar',
    markId: 'foo-bar-baz-123',
  }
})

const trackingQRCode = fromClass(QRCode).contramap((props: any) => ({
  value: JSON.stringify(props.registrationData),
}))

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps),
    reduce(concat, nothing()))([
    trackingQRCode,
    text({}, 'Scan this QR code with another device') ]))
