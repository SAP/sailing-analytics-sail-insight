import React from 'react'
import { Image, TouchableOpacity } from 'react-native'

import Images from '@assets/Images'
import I18n from 'i18n'
import TextButton from 'components/TextButton'

import { button } from 'styles/commons'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'

export default props => {
  const navigation = useNavigation()

  const {
    style,
    children,
    onPress,
    type = 'text',
    dropShadow,
    iconColor,
    ...extraProps
  } = props

  return type === 'text' ?
    <TextButton
      style={[styles.back, style]}
      textStyle={button.modalBack}
      onPress={onPress || navigation.goBack}
      {...extraProps}>
      {children || I18n.t('caption_cancel')}
    </TextButton > :
    <TouchableOpacity
      style={[styles.back, dropShadow ? styles.elevation : undefined, style]}
      onPress={onPress || navigation.goBack}>
      <Image
        style={[button.actionIconNavBar, iconColor && { tintColor: iconColor }]}
        source={Images.actions.close}/>
    </TouchableOpacity>
}
