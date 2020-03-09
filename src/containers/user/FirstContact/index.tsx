import TextButton from 'components/TextButton'
import I18n from 'i18n'
import {
  navigateToLoginFromSplash,
  navigateToQRScanner,
  navigateToUserRegistration,
} from 'navigation'
import React from 'react'
import { Image, ImageBackground, Text, View, ViewProps } from 'react-native'
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux'
import { isLoggedIn } from 'selectors/auth'
import { button, container } from 'styles/commons'
import Images from '../../../../assets/Images'
import styles from './styles'

interface Props {
  isLoggedIn: boolean,
}
class FirstContact extends React.Component<ViewProps & NavigationScreenProps & Props> {
  public render() {
    return (
        <ImageBackground source={Images.defaults.map2} style={{ width: '100%', height: '100%' }}>
        <View style={[container.main, styles.container]}>
          <View style={styles.textContainer}>
            <Image source={Images.defaults.app_logo} style={styles.app_logo}/>
            <Text style={styles.subtitle}>{I18n.t('subtitle_splash')}</Text>
            <TextButton
              style={[button.actionFullWidth, container.largeHorizontalMargin, styles.bigButton]}
              textStyle={styles.bigButtonText}
              onPress={navigateToUserRegistration}>
              {I18n.t('caption_register').toUpperCase()}
            </TextButton>
            <TextButton
              style={[container.largeHorizontalMargin, styles.bigButtonTransparent]}
              textStyle={styles.bigButtonText}
              onPress={navigateToQRScanner}>
              {I18n.t('caption_qr_scanner').toUpperCase()}
            </TextButton>
            { !this.props.isLoggedIn && <Text onPress={navigateToLoginFromSplash} style={styles.loginText}>
              {I18n.t('text_login_already_account')}
            </Text> }
          </View>

          <View style={styles.logoContainer}>
            <Image source={Images.defaults.ws_logo} style={styles.ws_logo} resizeMode="stretch"/>
            <Image source={Images.defaults.sap_logo} style={styles.sap_logo}/>
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedIn(state),
})

export default connect(mapStateToProps)(FirstContact)
