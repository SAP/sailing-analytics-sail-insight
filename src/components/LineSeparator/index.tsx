import React from 'react'
import { View } from 'react-native'

import { StyleSheetType } from 'helpers/types'
import styles from './styles'


class LineSeparator extends React.Component<{
  style?: StyleSheetType,
} > {
  public render() {
    const { style } = this.props


    return (
      <View style={[styles.separator, style]}/>
    )
  }
}


export default LineSeparator
