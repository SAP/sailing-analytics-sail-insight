import React from 'react'
import { Image, TouchableOpacity, ViewProps } from 'react-native'

import Images from '@assets/Images'
import I18n from 'i18n'
import { navigateBack } from 'navigation'

import TextButton from 'components/TextButton'

import { button } from 'styles/commons'
import styles from './styles'


class ModalBackButton extends React.Component<ViewProps & {
  onPress?: () => void,
  type?: 'icon' | 'text',
  dropShadow?: boolean,
  iconColor?: string,
}> {

  public render() {
    const {
      style,
      children,
      onPress,
      type = 'text',
      dropShadow,
      iconColor,
      ...props
    } = this.props
    return type === 'text' ? (
      <TextButton
        style={[styles.back, style]}
        textStyle={button.modalBack}
        onPress={onPress || navigateBack}
        {...props}
      >
        {children || I18n.t('caption_cancel')}
      </TextButton >
    ) : (
      <TouchableOpacity
        style={[styles.back, dropShadow ? styles.elevation : undefined, style]}
        onPress={onPress || navigateBack}
      >
        <Image
          style={[button.actionIconNavBar, iconColor && { tintColor: iconColor }]}
          source={Images.actions.close}
        />
      </TouchableOpacity>
    )
  }
}

export default ModalBackButton
