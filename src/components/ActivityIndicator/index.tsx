import React from 'react'
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  View,
} from 'react-native'


class Spinner extends React.Component<ActivityIndicatorProps> {
  public render() {
    const { style, color, ...remainingProps } = this.props
    return (
      <View style={style}>
        <ActivityIndicator color={color || 'white'} {...remainingProps} />
      </View>
    )
  }
}

export default Spinner
