import { __,  compose, concat, reduce, toUpper, mergeRight, isNil, propEq } from 'ramda'
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
import {BackHandler, Dimensions} from 'react-native'
import {
  updateMarkConfigurationWithCurrentDeviceAsTracker,
  fetchAndUpdateMarkConfigurationDeviceTracking,
  updateMarkPosition,
} from 'actions/courses'
import { getDeviceId } from 'selectors/user'
import { getSelectedEventInfo } from 'selectors/event'
import { getMarkConfigurationById } from 'selectors/course'
import { BRANCH_APP_DOMAIN } from 'environment'
import { useFocusEffect, useNavigationState } from '@react-navigation/native';
import {useCallback, useLayoutEffect} from 'react';
import I18n from 'i18n'
import HeaderBackButton from "../../../components/HeaderBackButton";

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

const nothingWhenInvalidMark = branch(propEq(true, 'invalidMark'), nothingAsClass)
const nothingWhenValidMark = branch(propEq(false, 'invalidMark'), nothingAsClass)

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
      // const continueBinding = await props.warnAboutMultipleBindingsToTheSameMark(
      //   props.selectedMarkConfiguration,
      // )
      //
      const markConfigurationId = props.selectedMarkConfiguration
      props.updateMarkConfigurationWithCurrentDeviceAsTracker({
        id: markConfigurationId,
        deviceId: getDeviceId()
      })
      props.updateMarkPosition({ markConfigurationId, bindToThisDevice: true })

      props.navigation.goBack()
    },
    style: styles.useThisDeviceButton,
  }),
  text({ style: styles.useThisDeviceButtonText }),
  toUpper)(
  I18n.t('caption_course_creator_use_this_device')))

const navigationBackHandler = ((props: any) => {
    useLayoutEffect(() => {
        const handleBackPress = () => {
            if (props.fetchAndUpdateMarkConfigurationDeviceTracking) {
                props.fetchAndUpdateMarkConfigurationDeviceTracking();
            }
            props.navigation.goBack()
        }

        props.navigation.setOptions({
            headerLeft: () => (
                <HeaderBackButton onPress={handleBackPress} />
            ),
        })

        const onHardwareBackPress = () => {
            if (props.fetchAndUpdateMarkConfigurationDeviceTracking) {
                props.fetchAndUpdateMarkConfigurationDeviceTracking();
            }
            props.navigation.goBack()
            return true
        }

        BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onHardwareBackPress)
        }
    }, [props.navigation, props.fetchAndUpdateMarkConfigurationDeviceTracking])

    return null
})


export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps, {
      updateMarkConfigurationWithCurrentDeviceAsTracker,
      fetchAndUpdateMarkConfigurationDeviceTracking,
      updateMarkPosition,
    }),
    view({ style: styles.container }),
    reduce(concat, nothing()))([
    navigationBackHandler(props),
    trackingQRCode,
    nothingWhenInvalidMark(text({ style: styles.scanText }, I18n.t('caption_scan_qr_code_for_mark_binding'))),
    useThisDeviceButton ]))
