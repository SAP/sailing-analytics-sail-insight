import React from 'react'
import {
  View, ViewProps,
} from 'react-native'

import Text from 'components/Text'

import { navigation } from 'styles/commons'
import styles from './styles'


class HeaderTitle extends React.Component<ViewProps & {
  firstLine?: string,
  secondLine?: string,
} > {
  public render() {
    const {
      style,
      firstLine,
      secondLine,
    } = this.props

    return (
      <View style={[styles.container, style]}>
        <Text
          style={[styles.baseHeading, !secondLine ? navigation.headerTitle : styles.heading]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {firstLine}
        </Text>
        {
          secondLine &&
          <Text style={styles.subHeading}>
            {secondLine}
          </Text>
        }
      </View>
    )
  }
}


export default HeaderTitle
