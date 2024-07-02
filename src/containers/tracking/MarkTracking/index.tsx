import { always, compose, concat, not, prop, reduce } from 'ramda'
import { Alert, Dimensions } from 'react-native'
import KeepAwake from 'react-native-keep-awake'

import Images from '@assets/Images'
import I18n from 'i18n'
import {
  Component,
  contramap,
  fold,
  fromClass,
  nothing,
  nothingAsClass,
  reduxConnect as connect,
  recomposeBranch as branch,
  recomposeLifecycle as lifecycle,
  recomposeWithState as withState,
} from 'components/fp/component'
import { button, icon, image, text, textButton, view } from 'components/fp/react-native'
import ConnectivityIndicator from 'components/ConnectivityIndicator'
import { button as buttonStyles, container } from 'styles/commons'
import { deleteMarkBinding } from 'actions/checkIn'
import { startTracking, stopTracking } from 'actions/tracking'
import { getMarkBindingCheckIn, getNameOfBoundMark, isDeletingMarkBinding } from 'selectors/checkIn'
import { getLocationStats, getLocationTrackingStatus } from 'selectors/location'
import { getUnknownErrorMessage } from 'helpers/texts'

import styles, { deleteBindingColor, headerImageBackgroundColor } from './styles'

const mapStateToProps = (state: any) => ({
  markName: getNameOfBoundMark(state),
  checkIn: getMarkBindingCheckIn(state),
  trackingStats: getLocationStats(state) || {},
  isDeletingMarkBinding: isDeletingMarkBinding(state),
  isTracking: getLocationTrackingStatus(state) === 'RUNNING'
})

const nothingIfNotTracking = branch(compose(not, prop('isTracking')), nothingAsClass)

const withKeepAwake = lifecycle({
  componentDidMount() {
    KeepAwake.activate()
  },
  componentWillUnmount() {
    KeepAwake.deactivate()
  }
})

const withIsLoading = withState('isLoading', 'setIsLoading', false)

const markImage = image({
  style: {
    width: '100%',
    resizeMode: 'contain',
    height: Dimensions.get('window').height * 0.4,
    backgroundColor: headerImageBackgroundColor
  },
  source: Images.tracking.markBoundHeader
})

const deleteIcon = icon({
  source: Images.actions.closeCircled,
  iconStyle: styles.deleteIconStyle,
  iconTintColor: deleteBindingColor
})

const deleteBindingAlert = () => new Promise(resolve =>
  Alert.alert('', I18n.t('text_delete_binding_alert'),
    [
      { text: I18n.t('caption_cancel'), onPress: () => resolve(false) },
      { text: I18n.t('button_yes'), onPress: () => resolve(true) }
    ],
    { cancelable: true },
  )
)

const deleteBindingButton = Component((props: any) => compose(
  fold(props),
  button({
    onPress: async () => {
      const isConfirmed = await deleteBindingAlert()
      if (isConfirmed) {
        props.deleteMarkBinding({ shouldStopTracking: props.isTracking })
      }
    },
    isLoading: props.isDeletingMarkBinding,
    preserveShapeWhenLoading: true,
    loadingColor: 'black'
  }),
  view({ style: styles.deleteBindingContainer }),
  concat(deleteIcon)
)(text({ style: styles.deleteBindingText }, I18n.t('caption_delete_mark_binding'))))

const gpsAccuracyDisplay = Component((props: any) => compose(
  fold(props),
  view({ style: styles.accuracyContainer }),
  reduce(concat, nothing())
)([
  text({ style: styles.accuracyTitle }, I18n.t('text_tracking_gps_accuracy')),
  text({ style: styles.accuracyValue }, props.trackingStats.locationAccuracy || '-'),
  text({ style: styles.accuracyValue }, props.trackingStats.locationAccuracy ? I18n.t('text_tracking_unit_meters') : '')
]))

const informationDisplay = Component((props: any) => compose(
  fold(props),
  view({
    style: styles.informationDisplayContainer
  }),
  reduce(concat, nothing())
)([
  text({ style: styles.markName }, (props.markName || '-').toUpperCase()),
  deleteBindingButton,
  nothingIfNotTracking(gpsAccuracyDisplay)
]))

const stopTrackingConfirmationDialog = () => new Promise(resolve =>
  Alert.alert('', I18n.t('text_tracking_alert_stop_confirmation_message'),
    [
      { text: I18n.t('caption_cancel'), onPress: () => resolve(false) },
      { text: I18n.t('button_yes'), onPress: () => resolve(true) }
    ],
    { cancelable: true }))

const trackingButton = Component((props: any) =>
  fold(props)(
  textButton({
    style: [buttonStyles.actionFullWidth, container.largeHorizontalMargin, styles.trackingButton],
    textStyle: styles.trackingButtonText,
    onPress: async () => {
      props.setIsLoading(true)
      if (props.isTracking) {
        if (await stopTrackingConfirmationDialog()) {
          try {
            await props.stopTracking(props.checkIn)
          } catch (err) {}
        }
      } else {
        try {
          await props.startTracking({ data: props.checkIn, navigation: props.navigation, useLoadingSpinner: false })
        } catch (err) {
          Alert.alert(I18n.t('caption_start_tracking'), getUnknownErrorMessage())
        }
      }
      props.setIsLoading(false)
    },
    isLoading: props.isLoading,
  },
  text({}, I18n.t(props.isTracking ? 'caption_stop_tracking' : 'caption_start_tracking').toUpperCase()))
))

const connectivityIndicator = Component((props:any) => compose(
  fold(props),
  contramap(always({
    style: styles.connectivity
  })))(
  fromClass(ConnectivityIndicator)))

export default Component((props:any) => compose(
  fold(props),
  withIsLoading,
  withKeepAwake,
  connect(mapStateToProps, { deleteMarkBinding, startTracking, stopTracking }),
  view({ style: styles.container }),
  reduce(concat, nothing())
)([
  connectivityIndicator,
  markImage,
  informationDisplay,
  trackingButton,
]))
