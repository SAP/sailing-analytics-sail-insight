import React from 'react'
import {
  View, ViewProps,
} from 'react-native'

import Images from '@assets/Images'
import styles from './styles'

import Image from 'components/Image'


class WaveActivityIndicator extends React.Component<ViewProps> {
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
