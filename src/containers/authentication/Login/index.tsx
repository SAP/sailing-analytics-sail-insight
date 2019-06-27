import { isEmpty } from 'lodash'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import { login } from 'actions/auth'
import { fetchUserInfo } from 'actions/user'
import { FORM_KEY_PASSWORD, FORM_KEY_USERNAME } from 'forms/registration'
import { getErrorDisplayMessage } from 'helpers/texts'
import I18n from 'i18n'
import { navigateToMain, navigateToPasswordReset } from 'navigation'

import TextInputForm from 'components/base/TextInputForm'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TextInput from 'components/TextInput'

import { button, container, image, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import IconText from '../../../components/IconText'
import { $primaryButtonColor } from '../../../styles/colors'
import styles from './styles'


class Login extends TextInputForm<{
  login: (u: string, p: string) => any,
  fetchUserInfo: () => void,
}> {
  public state = {
    username: '',
    password: '',
    isLoading: false,
    error: null,
  }

  public onSubmit = async () => {
    this.setState({ error: null })
    const { username, password } = this.state
    if (isEmpty(username) || isEmpty(password)) {
      return
    }
    try {
      this.setState({ isLoading: true })
      await this.props.login(username, password)
      this.props.fetchUserInfo()
      navigateToMain()
    } catch (err) {
      this.setState({ error: getErrorDisplayMessage(err) })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public onUsernameChange = (newValue: string) => this.setState({ username: newValue })
  public onPasswordChange = (newValue: string) => this.setState({ password: newValue })

  public render() {
    const { error, isLoading } = this.state
    return (
        <ScrollContentView extraHeight={$extraSpacingScrollContent}>
          <View style={container.stretchContent}>
            <Image style={image.headerMedium} source={Images.header.sailors}/>
            <Image style={image.tagLine} source={Images.corporateIdentity.sapTagLine}/>
            <View style={[registration.topContainer(), styles.textContainer]}>
              <Text style={registration.claim()}>
                <Text>{I18n.t('text_login_claim_01')}</Text>
                <Text style={text.claimHighlighted}>{I18n.t('text_login_claim_02')}</Text>
              </Text>
            </View>
          </View>
          <View style={registration.bottomContainer()}>
            <TextInput
                value={this.state.username}
                onChangeText={this.onUsernameChange}
                placeholder={I18n.t('text_placeholder_your_username')}
                keyboardType={'default'}
                returnKeyType="next"
                autoCapitalize="none"
                onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_PASSWORD)}
                inputRef={this.handleInputRef(FORM_KEY_USERNAME)}
            />
            <TextInput
                value={this.state.password}
                onChangeText={this.onPasswordChange}
                style={styles.password}
                placeholder={I18n.t('text_placeholder_enter_password')}
                keyboardType={'default'}
                returnKeyType="go"
                onSubmitEditing={this.onSubmit}
                secureTextEntry={true}
                inputRef={this.handleInputRef(FORM_KEY_PASSWORD)}
            />
            {error && <Text style={registration.errorText()}>{error}</Text>}
            <TextButton
                style={registration.nextButton()}
                textStyle={button.actionText}
                onPress={this.onSubmit}
                isLoading={isLoading}
            >
              {I18n.t('caption_lets_go')}
            </TextButton>

            <TouchableOpacity style={styles.forgotPassword} onPress={this.onPasswordResetPress}>
              <IconText
                  source={Images.actions.help}
                  iconTintColor={$primaryButtonColor}
                  textStyle={button.textButtonSecondaryText}
                  alignment="horizontal"
              >
                {I18n.t('caption_forgot_password')}
              </IconText>
            </TouchableOpacity>
          </View>
        </ScrollContentView>
    )
  }

  private onPasswordResetPress = () => {
    return navigateToPasswordReset()
  }
}
export default connect(null, { fetchUserInfo, login })(Login)
