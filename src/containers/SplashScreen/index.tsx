import React from 'react'
import { Image, View } from 'react-native'

import Images from '@assets/Images'
import { $primaryButtonColor } from 'styles/colors'
import { container } from 'styles/commons'
import styles from './styles'

import ActivityIndicator from 'components/ActivityIndicator'


class SplashScreen extends React.Component<{
  navigation: any,
} > {

  public render() {
    return (
      <View style={[container.main, styles.container]}>
        <View style={styles.logoContainer}>
          <Image source={Images.corporateIdentity.sapTagLine} style={styles.logo}/>
        </View>
        <ActivityIndicator
          style={styles.activityIndicator}
          color={$primaryButtonColor}
          size="large"
        />
      </View>
    )
  }
}

export default SplashScreen
