import { isString } from 'lodash'
import React from 'react'
import { StyleProp, TextProps, TextStyle, View } from 'react-native'

import Text from 'components/Text'

import styles from './styles'


class TitleLabel extends React.Component<TextProps & {
  title?: string,
  titleStyle?: StyleProp<TextStyle>
}> {
  public render() {
    const { children, style, titleStyle, title, ...remainingProps } = this.props
    const ComponentType = isString(children) ? Text : View
    return (
      <View style={[style]}>
        {title && <Text style={[styles.title, titleStyle]}>{title.toUpperCase()}</Text>}
        <ComponentType style={styles.text} {...remainingProps}>{children}</ComponentType>
      </View>
    )
  }
}

export default TitleLabel
