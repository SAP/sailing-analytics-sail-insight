import React from 'react'
import {
  View, ViewProps,
} from 'react-native'

import Text from 'components/Text'

import { navigation } from 'styles/commons'

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
      <View style={[navigation.container, style]}>
        <Text
          style={[(!secondLine ? navigation.heading : navigation.headingSmall)]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {firstLine}
        </Text>
        {
          secondLine &&
          <Text style={navigation.subHeading}>
            {secondLine}
          </Text>
        }
      </View>
    )
  }
}

export default HeaderTitle
