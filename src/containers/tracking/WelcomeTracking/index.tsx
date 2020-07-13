import React from 'react'
import { ImageBackground, Text, View, ViewProps, BackHandler } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
// import { when, isEmpty, always, either, isNil } from 'ramda'
import LinearGradient from 'react-native-linear-gradient';

import TextButton from 'components/TextButton'

import * as Screens from 'navigation/Screens'

// import User from 'models/User'

import { getUserInfo, isLoggedIn as isLoggedInSelector } from '../../../selectors/auth'

import I18n from 'i18n'

import Images from '@assets/Images'
import styles from './styles'
import { text, button } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

class WelcomeTracking extends React.Component<ViewProps & NavigationScreenProps> {
//  & {
//   isLoggedIn: boolean
//   user: User,
// }> {

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
  };

  public render() {
    // const { isLoggedIn, user } = this.props

    return (
      <ImageBackground source={Images.defaults.map3} style={{ width: '100%', height: '100%' }}>
        <LinearGradient colors={[$siTransparent, $siDarkBlue]} style={{ width: '100%', height: '100%' }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.85 }}>
        <View style={[styles.container]}>
          <View style={styles.contentContainer}>
            <Text style={[text.h1, styles.h1]}>
              {I18n.t('text_welcome')}
              {/* {isLoggedIn ? I18n.t('text_welcome_logged_in', { name: when(either(isEmpty, isNil), always(user.username))(user.fullName) }) : I18n.t('text_welcome')} */}
            </Text>
            <View style={styles.bottomContainer}>
              <TextButton
                style={[button.primary, button.fullWidth, styles.startTrackingButton]}
                textStyle={button.primaryText}
                onPress={() => this.props.navigation.navigate(Screens.TrackingList)}
              >
                {I18n.t('caption_start_tracking').toUpperCase()}
              </TextButton>
              <TextButton
                style={[button.secondaryInverted, button.fullWidth, styles.scanQRCodeButton]}
                textStyle={button.secondaryTextInverted}
                onPress={() => this.props.navigation.navigate(Screens.QRScanner)}
              >
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
  user: getUserInfo(state) || {},
  isLoggedIn: isLoggedInSelector(state),
})

export default connect(mapStateToProps)(WelcomeTracking)
