import React from 'react'
import { Image, ImageBackground, Text, View, ViewProps } from 'react-native'

import Images from '@assets/Images'
import I18n from 'i18n'
import { container } from 'styles/commons'
import styles from './styles'


class SplashScreen extends React.Component<ViewProps> {

  public render() {
    return (
      <ImageBackground source={Images.defaults.map} style={{ width: '100%', height: '100%' }}>
        <View style={[container.main, styles.container]}>
          <View style={styles.textContainer}>
            <Image source={Images.defaults.app_logo} style={styles.app_logo}/>
            <Text style={styles.subtitle}>{I18n.t('subtitle')}</Text>
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

export default SplashScreen
