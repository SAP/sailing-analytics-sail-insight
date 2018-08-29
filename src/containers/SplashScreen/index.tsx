import React from 'react'
import { Image, View } from 'react-native'

import Images from '@assets/Images'
import { $actionButtonColor } from 'styles/colors'
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
          <Image source={Images.corporateIdentity.sapBestRun} style={styles.logo}/>
        </View>
        <ActivityIndicator
          style={styles.activityIndicator}
          color={$actionButtonColor}
          size="large"
        />
      </View>
    )
  }
}

export default SplashScreen
