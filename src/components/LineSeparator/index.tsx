import React from 'react'
import { View, ViewProps } from 'react-native'

import styles from './styles'


class LineSeparator extends React.Component<ViewProps> {
  public render() {
    const { style } = this.props
    return (
      <View style={[styles.separator, style]}/>
    )
  }
}


export default LineSeparator
