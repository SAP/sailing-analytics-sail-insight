import React from 'react'
import LinearGradient from 'react-native-linear-gradient'


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
        colors={['#D9EFEF', '#D7DFE8']}
        {...remainingProps}
      >
        {children}
      </LinearGradient>
    )
  }
}

export default GradientContainer
