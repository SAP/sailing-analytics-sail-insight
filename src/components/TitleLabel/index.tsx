import { isString } from 'lodash'
import React from 'react'
import { TextProps, View } from 'react-native'

import Text from 'components/Text'

import styles from './styles'


class TitleLabel extends React.Component<TextProps & {
  title?: string,
}> {
  public render() {
    const { children, style, title, ...remainingProps } = this.props
    const ComponentType = isString(children) ? Text : View
    return (
      <View style={[style]}>
        {title && <Text style={[styles.title]}>{title.toUpperCase()}</Text>}
        <ComponentType style={styles.text} {...remainingProps}>{children}</ComponentType>
      </View>
    )
  }
}

export default TitleLabel
