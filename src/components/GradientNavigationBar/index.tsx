import React from 'react'
import { StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Header, HeaderProps } from 'react-navigation'

import styles from './styles'


class GradientNavigationBar extends React.Component<HeaderProps & {
  transparent: boolean,
} > {
  public render() {
    const { transparent, ...remainingProps } = this.props
    return (
      <View >
        <LinearGradient
          colors={transparent ? ['transparent', 'transparent'] : ['black', 'transparent']}
          style={[StyleSheet.absoluteFill, { height: Header.HEIGHT }]}
        >
          <Header
            {...remainingProps}
            style={styles.header}
          />
        </LinearGradient>
      </View>
    )
  }
}


export default GradientNavigationBar
