import React from 'react'
import LinearGradient from 'react-native-linear-gradient'

import {
  $containerBackgroundLowerColor,
  $containerBackgroundUpperColor,
} from 'styles/colors'


class GradientContainer extends React.Component<{
  children?: any,
  style?: any,
} > {
  public render() {
    const { children, ...remainingProps } = this.props
    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        colors={[$containerBackgroundUpperColor, $containerBackgroundLowerColor]}
        {...remainingProps}
      >
        {children}
      </LinearGradient>
    )
  }
}

export default GradientContainer
