import React from 'react'
import { Alert, Image, ImageBackground, View, ViewProps } from 'react-native'
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';

import { registerNetStateListeners, unregisterNetStateListeners, registerAppStateListeners, unregisterAppStateListeners } from 'actions/appState'
import { isNetworkConnected } from 'selectors/network';
import { isLoggedIn } from 'selectors/auth'
import { QRScanner, LoginFromSplash, RegisterCredentials } from 'navigation/Screens'
import TextButton from 'components/TextButton'
import I18n from 'i18n'

import Images from '@assets/Images'

import styles from './styles'
import { button } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

interface Props {
  isLoggedIn: boolean,
  isConnected: boolean,
  registerNetStateListeners: () => void,
  unregisterNetStateListeners: () => void,
  registerAppStateListeners: () => void,
  unregisterAppStateListeners: () => void,
}
class FirstContact extends React.Component<ViewProps & NavigationScreenProps & Props> {

  componentDidMount() {
    this.props.registerAppStateListeners()
    this.props.registerNetStateListeners()
  }

  componentWillUnmount() {
    this.props.unregisterAppStateListeners()
    this.props.unregisterNetStateListeners()
  }

  showNetworkAlert() {
    Alert.alert(I18n.t('caption_no_connectivity'), I18n.t('text_alert_no_connectivity'))
  }

  public render() {
    return (
      <ImageBackground source={Images.defaults.map3} style={{ width: '100%', height: '100%' }}>
        <LinearGradient colors={[$siTransparent, $siDarkBlue]} style={{ width: '100%', height: '100%' }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.97 }}>
          <View style={[styles.container]}>
            <View style={styles.contentContainer}>
              <Image source={Images.defaults.app_logo} style={styles.appLogo} resizeMode="contain"/>
              <View style={styles.buttonContainer}>
                <TextButton
                  style={[button.primary]}
                  textStyle={button.primaryText}
                  onPress={() => this.props.isConnected ? this.props.navigation.navigate(RegisterCredentials) : this.showNetworkAlert()}>
                  {I18n.t('caption_register').toUpperCase()}
                </TextButton>
                <TextButton
                  style={[button.secondary]}
                  textStyle={button.secondaryText}
                  onPress={() => this.props.isConnected ? this.props.navigation.navigate(QRScanner) : this.showNetworkAlert()}>
                  {I18n.t('caption_qr_scanner').toUpperCase()}
                </TextButton>
                <TextButton
                  style={[button.secondary]}
                  textStyle={button.secondaryText}
                  onPress={() => this.props.isConnected ? this.props.navigation.navigate(LoginFromSplash) : this.showNetworkAlert()}>
                  {I18n.t('text_login').toUpperCase()}
                </TextButton>
              </View>
            </View>
            <View style={styles.sponsorLogoContainer}>
              <Image source={Images.defaults.ws_logo} style={styles.wsLogo} resizeMode="stretch"/>
              <Image source={Images.defaults.sap_logo} style={styles.sapLogo}/>
              <Image source={Images.defaults.syrf_logo} style={styles.syrfLogo}/>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedIn(state),
  isConnected: isNetworkConnected(state),
})

export default connect(
  mapStateToProps, 
  { registerNetStateListeners, 
    unregisterNetStateListeners,
    registerAppStateListeners,
    unregisterAppStateListeners,
  }
  )(FirstContact)
