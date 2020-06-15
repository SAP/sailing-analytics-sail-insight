import React from 'react'
import { Image, ImageBackground, Text, View, ViewProps } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import I18n from 'i18n'

import Images from '@assets/Images'
import styles from './styles'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

class SplashScreen extends React.Component<ViewProps> {

  public render() {
    return (
      <ImageBackground source={Images.defaults.map3}
        style={{ width: '100%', height: '100%' }}>
        <LinearGradient
          colors={[$siTransparent, $siDarkBlue]}
          style={{ width: '100%', height: '100%' }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.97 }}>
          <View style={[styles.container]}>
            <View style={styles.contentContainer}>
              <Image source={Images.defaults.app_logo} style={styles.appLogo} resizeMode="contain" />
              <Text style={styles.subtitle}>{I18n.t('subtitle_splash')}</Text>
            </View>
            <View style={styles.sponsorLogoContainer}>
              <Image source={Images.defaults.ws_logo} style={styles.wsLogo} resizeMode="stretch" />
              <Image source={Images.defaults.sap_logo} style={styles.sapLogo} />
              <Image source={Images.defaults.syrf_logo} style={styles.syrfLogo} />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    )
  }
}

export default SplashScreen
