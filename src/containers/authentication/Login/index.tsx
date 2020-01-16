import { isEmpty } from 'lodash'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import { login } from 'actions/auth'
import { fetchUserInfo } from 'actions/user'
import { FORM_KEY_PASSWORD, FORM_KEY_USERNAME } from 'forms/registration'
import I18n from 'i18n'
import { navigateToMainTabs, navigateToPasswordReset } from 'navigation'

import TextInputForm from 'components/base/TextInputForm'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TextInput from 'components/TextInput'

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

    // custom validation
    let errorMsg = null
    if (isEmpty(username)) {
      errorMsg = I18n.t('error_need_username')
    }
    if (isEmpty(password)) {
      const errMsg = I18n.t('error_need_password')
      if (errorMsg != null) {
        errorMsg = `${errorMsg}\n${errMsg}`
      } else {
        errorMsg = errMsg
      }
    }
    if (errorMsg != null) {
      this.setState({ error: errorMsg })
      return
    }

    // try to login
    try {
      this.setState({ isLoading: true })
      await this.props.login(username, password)
      this.props.fetchUserInfo()
      navigateToMainTabs()
    } catch (err) {
      this.setState({ error: I18n.t('error_login_incorrect') })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public onUsernameChange = (newValue: string) => this.setState({ username: newValue })
  public onPasswordChange = (newValue: string) => this.setState({ password: newValue })

  public render() {
    const { error, isLoading } = this.state
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <ScrollContentView style={styles.scrollContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.claim}>{I18n.t('text_login').toUpperCase()}</Text>
          </View>
          <View style={styles.inputField}>
            <TextInput
                value={this.state.username}
                onChangeText={this.onUsernameChange}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputStyle}
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
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputStyle}
                placeholder={I18n.t('text_placeholder_enter_password')}
                keyboardType={'default'}
                returnKeyType="go"
                onSubmitEditing={this.onSubmit}
                secureTextEntry={true}
                inputRef={this.handleInputRef(FORM_KEY_PASSWORD)}
            />
            <TouchableOpacity style={styles.forgotPassword} onPress={this.onPasswordResetPress}>
              <Text style={styles.forgotPwText}>
                {I18n.t('caption_forgot_password')}
              </Text>
            </TouchableOpacity>
            {error && <View style={styles.redBalloon}><Text style={styles.redBalloonText}>{error}</Text><Image resizeMode='center' style={styles.attention} source={Images.defaults.attention} /></View>}
          </View>
          <View style={styles.bottomButtonField}>
            <TextButton
                style={styles.loginButton}
                textStyle={styles.loginButtonText}
                onPress={this.onSubmit}
                isLoading={isLoading}
            >
              {I18n.t('caption_login').toUpperCase()}
            </TextButton>
          </View>
        </ScrollContentView>
      </View>
    )
  }

  private onPasswordResetPress = () => {
    return navigateToPasswordReset()
  }
}
export default connect(null, { fetchUserInfo, login })(Login)
