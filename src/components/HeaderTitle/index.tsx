import React from 'react'
import {
  Text,
  View,
} from 'react-native'


import { StyleSheetType } from 'helpers/types'
import styles from './styles'

class HeaderTitle extends React.Component<{
  firstLine?: string,
  secondLine?: string,
  style?: StyleSheetType,
} > {
  public render() {
    const {
      style,
      firstLine,
      secondLine,
    } = this.props


    return (
      <View style={[styles.container, style]}>
        <Text style={styles.heading}>
          {firstLine}
        </Text>
        <Text style={styles.subHeading}>
          {secondLine}
        </Text>
      </View>
    )
  }
}


export default HeaderTitle
