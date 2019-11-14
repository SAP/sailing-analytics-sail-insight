import { compose, intersperse, when, always,
  equals, not, isNil, append, reverse,
  addIndex, map } from 'ramda'
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

const mapIndexed = addIndex(map)

class IconText extends React.Component<ViewProps & {
  iconStyle?: ImageStyle | ImageStyle[],
  iconOnly: Boolean,
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

    const icon = <Image
        style={[styles.baseIcon, iconStyle, tintStyle]}
        source={source}
      />
    const text = <Text style={[styles.baseText, textStyle]}>{children}</Text>
    const separator = <View style={styles.separator} />

    const content = compose(
      mapIndexed((element, i) => React.cloneElement(element, { key: i })),
      intersperse(separator),
      when(always(equals('second', iconPosition)), reverse),
      when(always(compose(not, isNil)(children)), append(text)))(
      [icon])

    return <View style={[styles.baseItem, alignmentStyle, style]}>
        {content}
      </View>
  }
}

export default IconText
