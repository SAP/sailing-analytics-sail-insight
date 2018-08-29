import React from 'react'

import TextButton from 'components/TextButton'
import { StyleSheetType } from 'helpers/types'
import I18n from 'i18n'
import { navigateBack } from 'navigation'
import { button } from 'styles/commons'
import styles from './styles'


class ModalBackButton extends React.Component<{
  style?: StyleSheetType,
  onPress?: () => void,
}> {

  public render() {
    const {
      style,
      children,
      onPress,
      ...props
    } = this.props
    return (
      <TextButton
        style={[styles.back, style]}
        textStyle={button.modalBack}
        onPress={onPress || navigateBack}
        {...props}
      >
        {children || I18n.t('caption_cancel')}
      </TextButton >
    )
  }
}

export default ModalBackButton
