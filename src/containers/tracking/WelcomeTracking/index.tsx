import I18n from 'i18n'
import React, { useEffect, useState } from 'react'
import { useAutomaticDateTimeAndTimezone } from 'helpers/date'
import { ImageBackground, Text, View, ViewProps, BackHandler, Image, AppState } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { CommonActions } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import TextButton from 'components/TextButton'
import * as Screens from 'navigation/Screens'
import { getLocationTrackingStatus, getLocationTrackingContext } from 'selectors/location'
import * as LocationService from 'services/LocationService'

import Images from '@assets/Images'
import styles from './styles'
import { text, button } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

const AutomaticTimeNotice = () => {
  const [noticeVisible, setNoticeVisible] = useState(!useAutomaticDateTimeAndTimezone())
  const appStateChangeHandler = () =>
    setNoticeVisible(!useAutomaticDateTimeAndTimezone())

  useEffect(() => {
    const subscription = AppState.addEventListener('change', appStateChangeHandler)

    return () => subscription.remove();
  },
  [])

  return noticeVisible ?
    <View style={styles.automaticTimeNotice}>
      <Image resizeMode='center' style={styles.attentionIcon} source={Images.defaults.attention} />
      <Text style={styles.automaticTimeNoticeText}>{I18n.t('text_automatic_time_warning')}</Text>
    </View> :
    null
}

class WelcomeTracking extends React.Component<ViewProps & NavigationScreenProps & {
  isTrackingActive?: boolean
}> {
  private backHandlerSubscription: any
  private removeFocusListener?: () => void

  constructor(props: any) {
    super(props)
    this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this)
  }

  componentDidMount() {
    this.backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    // Repair on every focus, not only on mount/status transition: the
    // screen can become visible again without either (e.g. the stack
    // pops back to it) while tracking is already active.
    this.removeFocusListener = this.props.navigation.addListener('focus', this.navigateIfTracking)
    this.navigateIfTracking()
  }

  componentDidUpdate(prevProps: any) {
    if (!prevProps.isTrackingActive && this.props.isTrackingActive) {
      this.navigateIfTracking()
    }
  }

  componentWillUnmount() {
    if (this.backHandlerSubscription) this.backHandlerSubscription.remove()
    if (this.removeFocusListener) this.removeFocusListener()
  }

  navigateIfTracking = () => {
    if (!this.props.isTrackingActive) {
      return
    }
    // Remove this screen (and the start list) from the stack instead of
    // pushing on top of it: the stack then matches a fresh launch during
    // tracking ([Tracking] only), nothing can pop back here, and reset
    // swaps without a transition animation. Existing screens keep their
    // keys, so a mounted Tracking screen does not remount.
    this.props.navigation.dispatch((state: any) => {
      const routes = state.routes.filter((route: any) =>
        route.name !== Screens.WelcomeTracking && route.name !== Screens.TrackingList)
      if (routes.length === 0) {
        routes.push({ name: Screens.Tracking })
      }
      return CommonActions.reset({ ...state, routes, index: routes.length - 1 })
    })
  }

  onBackButtonPressAndroid = () => {
    if (this.props.navigation.isFocused()) {
      BackHandler.exitApp()
      return true
    }
    return false
  }

  public render() {
    return (
      <ImageBackground source={Images.defaults.map3} style={{ width: '100%', height: '100%' }}>
        <LinearGradient colors={[$siTransparent, $siDarkBlue]} style={{ width: '100%', height: '100%' }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.85 }}>
        <View style={[styles.container]}>
          <View style={styles.contentContainer}>
            <Text style={[text.h1, styles.h1]}>
              {I18n.t('text_welcome')}
            </Text>
            <AutomaticTimeNotice/>
            <View style={styles.bottomContainer}>
              <TextButton
                style={[button.primary, button.fullWidth, styles.startTrackingButton]}
                textStyle={button.primaryText}
                onPress={() => this.props.navigation.navigate(Screens.TrackingList)}>
                {I18n.t('caption_start_tracking').toUpperCase()}
              </TextButton>
              <TextButton
                style={[button.secondaryInverted, button.fullWidth, styles.scanQRCodeButton]}
                textStyle={button.secondaryTextInverted}
                onPress={() => this.props.navigation.navigate(Screens.QRScanner)}>
                {I18n.t('caption_qr_scanner').toUpperCase()}
              </TextButton>
            </View>
          </View>
        </View>
        </LinearGradient>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state: any) => ({
  isTrackingActive:
    getLocationTrackingContext(state) === LocationService.LocationTrackingContext.REMOTE &&
    getLocationTrackingStatus(state) === LocationService.LocationTrackingStatus.RUNNING
})

export default connect(mapStateToProps)(WelcomeTracking)
