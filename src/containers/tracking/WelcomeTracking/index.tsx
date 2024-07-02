import I18n from 'i18n'
import React, { useEffect, useState } from 'react'
import { useAutomaticDateTimeAndTimezone } from 'helpers/date'
import { ImageBackground, Text, View, ViewProps, BackHandler, Image, AppState } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'
import TextButton from 'components/TextButton'
import * as Screens from 'navigation/Screens'

import Images from '@assets/Images'
import styles from './styles'
import { text, button } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

const AutomaticTimeNotice = () => {
  const [noticeVisible, setNoticeVisible] = useState(!useAutomaticDateTimeAndTimezone())
  const appStateChangeHandler = () =>
    setNoticeVisible(!useAutomaticDateTimeAndTimezone())

  useEffect(() => {
    AppState.addEventListener('change', appStateChangeHandler)

    return () => AppState.removeEventListener('change', appStateChangeHandler)
  },
  [])

  return noticeVisible ?
    <View style={styles.automaticTimeNotice}>
      <Image resizeMode='center' style={styles.attentionIcon} source={Images.defaults.attention} />
      <Text style={styles.automaticTimeNoticeText}>{I18n.t('text_automatic_time_warning')}</Text>
    </View> :
    null
}

class WelcomeTracking extends React.Component<ViewProps & NavigationScreenProps> {
  constructor(props: any) {
    super(props)
    this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this)
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
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

export default WelcomeTracking
