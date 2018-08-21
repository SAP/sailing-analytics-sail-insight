import React from 'react'
import {
  ActivityIndicator,
  View,
} from 'react-native'


import styles from './styles'

class Spinner extends React.Component<{
  size?: number | 'small' | 'large',
  style?: any,
} > {
  public static defaultProps = {
    size: 'small',
  }

  public render() {
    const { size, style } = this.props
    return (
      <View style={[styles.spinnerStyle, style]}>
        <ActivityIndicator size={size} />
      </View>
    )
  }
}

export default Spinner
