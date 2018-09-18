import React from 'react'
import { Image, TouchableOpacity, ViewProps } from 'react-native'

import Images from '@assets/Images'
import I18n from 'i18n'
import { navigateBack } from 'navigation'
import { button } from 'styles/commons'
import styles from './styles'

import TextButton from 'components/TextButton'


class ModalBackButton extends React.Component<ViewProps & {
  onPress?: () => void,
  type?: 'icon' | 'text',
}> {

  public render() {
    const {
      style,
      children,
      onPress,
      type = 'text',
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
        style={[styles.back, style]}
        onPress={onPress || navigateBack}
      >
        <Image style={button.actionIconNavBar} source={Images.actions.close}/>
      </TouchableOpacity>
    )
  }
}

export default ModalBackButton
