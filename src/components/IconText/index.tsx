import React from 'react'
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  View,
  ViewProps,
} from 'react-native'

import Text from 'components/Text'

import styles from './styles'


class IconText extends React.Component<ViewProps & {
  iconStyle?: ImageStyle | ImageStyle[],
  iconTintColor?: string | null,
  textStyle?: TextStyle | TextStyle[],
  source: ImageSourcePropType,
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
    const text = <Text style={[styles.baseText, textStyle]}>{children}</Text>
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
