import React from 'react'
import {
  Image, TouchableOpacity, View,
} from 'react-native'

import Images from '@assets/Images'
import { StyleSheetType } from 'helpers/types'
import styles from './styles'

import Text from 'components/Text'


class TrackingProperty extends React.Component<{
  style?: StyleSheetType,
  title: string,
  value: string,
  unit?: string,
  titleFontSize?: number,
  valueFontSize?: number,
  unitFontSize?: number,
  onPress?: () => void,
} > {
  public render() {
    const {
      style,
      title,
      value,
      unit,
      titleFontSize,
      valueFontSize,
      unitFontSize,
      onPress,
    } = this.props
    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
        disabled={!onPress}
      >
        <Text style={[styles.title, titleFontSize && { fontSize: titleFontSize }]}>
          {title && title.toUpperCase()}
        </Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, valueFontSize && { fontSize: valueFontSize }]}>
            {value}
            {
              unit &&
              <Text style={[styles.unit, unitFontSize && { fontSize: unitFontSize }]}>{` ${unit.toUpperCase()}`}</Text>
            }
          </Text>
          {onPress && <Image source={Images.actions.arrowRight} style={styles.actionIcon}/>}
        </View>
      </TouchableOpacity>
    )
  }
}

export default TrackingProperty
