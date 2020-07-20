import { __,  compose, concat, reduce, toUpper, merge, isNil, propEq } from 'ramda'
import querystring from 'query-string'
import QRCode from 'react-native-qrcode-svg'
import {
  Component,
  fold,
  fromClass,
  nothing,
  contramap,
  reduxConnect as connect,
  recomposeBranch as branch,
  nothingAsClass
} from 'components/fp/component'
import { text, touchableOpacity, view } from 'components/fp/react-native'
import styles from './styles'
import { Dimensions } from 'react-native'
import { warnAboutMultipleBindingsToTheSameMark } from 'actions/checkIn'
import { updateMarkConfigurationWithCurrentDeviceAsTracker, fetchAndUpdateMarkConfigurationDeviceTracking } from 'actions/courses'
import { getDeviceId } from 'selectors/user'
import { getSelectedEventInfo } from 'selectors/event'
import { getMarkConfigurationById } from 'selectors/course'
import { BRANCH_APP_DOMAIN } from 'environment'
import { NavigationEvents } from '@react-navigation/compat'
import I18n from 'i18n'

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
    qrCodeLink: `https://${BRANCH_APP_DOMAIN}/invite?checkinUrl=${encodeURIComponent(checkinUrl)}`,
    invalidMark: isNil(markId)
  }
}

const nothingWhenInvalidMark = branch(propEq('invalidMark', true), nothingAsClass)
const nothingWhenValidMark = branch(propEq('invalidMark', false), nothingAsClass)

const InvalidMarkOverlay = Component(props => compose(
  fold(props),
  view({ style: styles.invalidMarkOverlay }),
  text({ style: styles.invalidMarkText }))(
  I18n.t('caption_invalid_qr_code_missing_mark')))

const trackingQRCode = Component(props => compose(
  fold(props),
  view({ style: styles.qrCodeContainer }),
  concat(__, nothingWhenValidMark(InvalidMarkOverlay)))(
  fromClass(QRCode).contramap((props: any) => ({
    value: props.qrCodeLink,
    size: qrCodeWidth,
    backgroundColor: 'white',
    quietZone: 10
  }))))

const useThisDeviceButton = Component(props => compose(
  fold(props),
  touchableOpacity({
    onPress: async () => {
      const continueBinding = await props.warnAboutMultipleBindingsToTheSameMark(
        props.selectedMarkConfiguration,
      )

      if (continueBinding) {
        console.log('This gets executed')
        props.updateMarkConfigurationWithCurrentDeviceAsTracker({
          id: props.selectedMarkConfiguration,
          deviceId: getDeviceId()
        })
      }

      props.navigation.goBack()
    },
    style: styles.useThisDeviceButton,
  }),
  text({ style: styles.useThisDeviceButtonText }),
  toUpper)(
  I18n.t('caption_course_creator_use_this_device')))

const NavigationBackHandler = Component((props: any) => compose(
  fold(props),
  contramap(merge({
    onWillBlur: (payload: any) => (!payload || !payload.state) && props.fetchAndUpdateMarkConfigurationDeviceTracking()
  })),
  fromClass)(
  NavigationEvents))

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps, {
      updateMarkConfigurationWithCurrentDeviceAsTracker,
      fetchAndUpdateMarkConfigurationDeviceTracking,
      warnAboutMultipleBindingsToTheSameMark,
    }),
    view({ style: styles.container }),
    reduce(concat, nothing()))([
    NavigationBackHandler,
    trackingQRCode,
    nothingWhenInvalidMark(text({ style: styles.scanText }, I18n.t('caption_scan_qr_code_for_mark_binding'))),
    useThisDeviceButton ]))
