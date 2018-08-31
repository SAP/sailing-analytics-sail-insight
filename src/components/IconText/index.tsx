import React from 'react'
import {
  Image, View,
} from 'react-native'

import Text from 'components/Text'
import { ImageSource, StyleSheetType } from 'helpers/types'
import styles from './styles'


class IconText extends React.Component<{
  style?: StyleSheetType,
  iconStyle?: StyleSheetType,
  iconTintColor?: string | null,
  textStyle?: StyleSheetType,
  source?: ImageSource,
  iconPosition?: 'first' | 'second',
  alignment?: 'horizontal' | 'vertical',
} > {
  public render() {
    const {
      children,
      textStyle,
      iconStyle,
      iconTintColor,
      source,
      style,
      iconPosition = 'first',
      alignment = 'vertical',
    } = this.props

    const tintStyle = iconTintColor ? { tintColor: iconTintColor } : null
    const alignmentStyle = { flexDirection: alignment === 'vertical' ? 'column' : 'row' }

    const icon = (
      <Image
        style={[styles.baseIcon, iconStyle, tintStyle]}
        source={source}
      />
    )
    const text = (
      <Text style={[styles.baseText, textStyle]}>{children}</Text>
    )
    const separator = <View style={styles.separator} />

    return iconPosition === 'second' ? (
      <View style={[styles.baseItem, alignmentStyle, style]}>
        {text}
        {separator}
        {icon}
      </View>

    ) : (
      <View style={[styles.baseItem, alignmentStyle, style]}>
        {icon}
        {separator}
        {text}
      </View>
    )
  }
}


export default IconText
