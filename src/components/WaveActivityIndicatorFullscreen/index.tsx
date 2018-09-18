import React from 'react'
import {
  StyleSheet,
  View,
  ViewProps,
} from 'react-native'

import styles from './styles'

import WaveActivityIndicator from 'components/WaveActivityIndicator'


class WaveActivityIndicatorFullscreen extends React.Component<ViewProps> {
  public static defaultProps = {
    size: 'small',
  }

  public render() {
    const { style } = this.props
    return (
      <View style={[StyleSheet.absoluteFill, styles.container, style]}>
        <WaveActivityIndicator style={styles.indicator}/>
      </View>
    )
  }
}

export default WaveActivityIndicatorFullscreen
