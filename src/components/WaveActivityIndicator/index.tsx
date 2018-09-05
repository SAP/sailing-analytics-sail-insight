import React from 'react'
import {
  View,
} from 'react-native'

import Images from '@assets/Images'
import { StyleSheetType } from 'helpers/types'
import styles from './styles'

import Image from 'components/Image'


class WaveActivityIndicator extends React.Component<{
  style?: StyleSheetType,
} > {
  public static defaultProps = {
    size: 'small',
  }

  public render() {
    const { style } = this.props
    return (
      <View style={style}>
        <Image
          style={[styles.activityIndicatorItem]}
          source={Images.animations.waveLoadingIndicatorBackground}
        >
          <Image
            style={[styles.activityIndicatorItem]}
            source={Images.animations.waveLoadingIndicatorGif}
          />
        </Image>
      </View>
    )
  }
}

export default WaveActivityIndicator
