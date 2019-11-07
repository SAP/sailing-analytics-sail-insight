import { isEmpty } from 'lodash'
import React from 'react'
import { ImageBackground, TouchableOpacity, View } from 'react-native'
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
      <ImageBackground source={Images.defaults.background} style={{ width: '100%', height: '100%' }}>
        <ScrollContentView style={styles.scrollContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.claim}>{I18n.t('text_login').toUpperCase()}</Text>
          </View>
          <View style={styles.inputField}>
            <TextInput
                value={this.state.username}
                onChangeText={this.onUsernameChange}
                style={styles.userName}
                containerStyle={styles.inputContainer}
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
                placeholder={I18n.t('text_placeholder_enter_password')}
                keyboardType={'default'}
                returnKeyType="go"
                onSubmitEditing={this.onSubmit}
                secureTextEntry={true}
                inputRef={this.handleInputRef(FORM_KEY_PASSWORD)}
            />
            <TouchableOpacity style={styles.forgotPassword} onPress={this.onPasswordResetPress}>
              <Text style={{ color: '#FFFFFF' }}>
                {I18n.t('caption_forgot_password')}
              </Text>
            </TouchableOpacity>
            {error && <View style={styles.redBalloon}><Text style={styles.redBalloonText}>{error}</Text></View>}

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
      </ImageBackground>
    )
  }

  private onPasswordResetPress = () => {
    return navigateToPasswordReset()
  }
}
export default connect(null, { fetchUserInfo, login })(Login)
