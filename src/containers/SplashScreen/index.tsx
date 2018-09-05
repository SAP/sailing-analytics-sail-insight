import React from 'react'
import { Image, View } from 'react-native'

import Images from '@assets/Images'
import { container } from 'styles/commons'
import styles from './styles'

import WaveActivityIndicator from 'components/WaveActivityIndicator'


class SplashScreen extends React.Component<{
  navigation: any,
} > {

  public render() {
    return (
      <View style={[container.main, styles.container]}>
        <View style={styles.logoContainer}>
          <Image source={Images.corporateIdentity.sapTagLine} style={styles.logo}/>
        </View>
        <View style={styles.activityIndicatorContainer}>
          <WaveActivityIndicator style={styles.activityIndicator}/>
        </View>
      </View>
    )
  }
}

export default SplashScreen
