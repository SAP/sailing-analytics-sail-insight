import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import I18n from 'i18n'

import TextButton from 'components/TextButton'

import Images from '@assets/Images'

import styles from './styles'

export default (props) => {
  const navigation = useNavigation()

  const {
    style,
    children,
    onPress,
    type = 'text',
    dropShadow,
    icon,
    iconColor,
    ...extraProps
  } = props

  return type === 'text' ?
    <TextButton
      style={[styles.back, style]}
      // textStyle={button.modalBack}
      onPress={onPress || navigation.goBack}
      {...extraProps}>
      {children || I18n.t('caption_cancel')}
    </TextButton > :
    <TouchableOpacity
      style={[styles.back, dropShadow ? styles.elevation : undefined, style]}
      onPress={onPress || navigation.goBack}>
      <Image
        style={[iconColor && { tintColor: iconColor }]}
        source={icon || Images.actions.close}/>
    </TouchableOpacity>
}
