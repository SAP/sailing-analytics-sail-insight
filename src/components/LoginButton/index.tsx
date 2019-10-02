import React from 'react'
import { TouchableOpacity, ViewProps } from 'react-native'

import Images from '@assets/Images'
import I18n from 'i18n'
import { navigateToLogin, navigateToModalLogin } from 'navigation'

import IconText from 'components/IconText'

import { $primaryButtonColor } from 'styles/colors'
import { button } from 'styles/commons'


class LoginButton extends React.Component<ViewProps & {isModal?: boolean}> {
  public static defaultProps = {
    isModal: false,
  }

  public render() {
    const { style } = this.props
    return (
      <TouchableOpacity onPress={this.onLoginPress}>
        <IconText
          style={style}
          source={Images.tabs.account}
          iconTintColor={$primaryButtonColor}
          textStyle={button.textButtonSecondaryText}
          alignment="horizontal"
        >
          {I18n.t('caption_login')}
        </IconText>
      </TouchableOpacity>
    )
  }

  private onLoginPress = () => {
    const { isModal } = this.props
    return isModal ? navigateToModalLogin() : navigateToLogin()
  }
}

export default LoginButton
