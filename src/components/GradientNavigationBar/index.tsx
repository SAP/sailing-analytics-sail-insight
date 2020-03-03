import React from 'react'
import { StyleSheet, View, Dimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { StackHeaderProps } from '@react-navigation/stack'

class GradientNavigationBar extends React.Component<StackHeaderProps & {
  transparent: boolean,
} > {
  public render() {
    const { transparent } = this.props
    return (
      <View>
        <LinearGradient
          colors={transparent ? ['transparent', 'transparent'] : ['black', 'transparent']}
          style={[StyleSheet.absoluteFill, 
            { ...Platform.select({
              android: {height: Dimensions.get('screen').height - Dimensions.get('window').height + getStatusBarHeight(true)}
            })}]}
        >
        </LinearGradient>
      </View>
    )
  }
}


export default GradientNavigationBar
