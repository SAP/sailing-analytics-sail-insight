import { isEmpty } from 'lodash'
import React from 'react'
import { Image, TouchableOpacity, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';

import { login } from 'actions/auth'
import { fetchUserInfo, syncEventList } from 'actions/user'
import { loadMarkProperties } from 'actions/inventory'
import { FORM_KEY_PASSWORD, FORM_KEY_USERNAME } from 'forms/registration'
import * as Screens from 'navigation/Screens'
import { PasswordReset } from 'navigation/Screens'
import { isNetworkConnected } from 'selectors/network'
import EulaLink from 'components/EulaLink'

import I18n from 'i18n'

import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TextInput from 'components/TextInput'
import TextInputForm from 'components/base/TextInputForm'

import Images from '../../../../assets/Images'
import styles from './styles'
import { text, form, button } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

class Login extends TextInputForm<{
  login: (u: string, p: string) => any,
  fetchUserInfo: () => void,
  syncEventList: () => void,
  isNetworkConnected: boolean
}> {
  public state = {
    username: '',
    password: '',
    isLoading: false,
    error: null,
    usernameError: null,
    passwordError: null,
  }

  public onSubmit = async () => {
    this.setState({ error: null })
    const { username, password } = this.state

    // custom validation
    let errorMsg = null
    let usernameError = null
    let passwordError = null

    if(!this.props.isNetworkConnected) {
      errorMsg = I18n.t('error_network_required_snackbar')
      this.setState({ error: errorMsg })
      return
    }

    if (isEmpty(username)) {
      usernameError = I18n.t('error_need_username')
      errorMsg = usernameError
    }
    if (isEmpty(password)) {
      passwordError = I18n.t('error_need_password')
      const errMsg = passwordError
      if (errorMsg != null) {
        errorMsg = `${errorMsg}\n${errMsg}`
      } else {
        errorMsg = errMsg
      }
    }
    if (errorMsg != null) {
      this.setState({ error: errorMsg, usernameError, passwordError })
      return
    }

    try {
      this.setState({ isLoading: true })
      await this.props.login(username, password)
      this.props.fetchUserInfo()
      this.props.loadMarkProperties({ createMissingDefaultMarkProperties: false })
      this.props.syncEventList()
      this.props.navigation.reset({ index: 1, routes: [{ name: Screens.Main }]})
    } catch (err) {
      passwordError = I18n.t('error_login_incorrect')
      this.setState({ error: passwordError, usernameError, passwordError })
      this.setState({ isLoading: false })
    }
  }

  public onUsernameChange = (newValue: string) => this.setState({ username: newValue })
  public onPasswordChange = (newValue: string) => this.setState({ password: newValue })

  public render() {
    const { error, isLoading, usernameError, passwordError } = this.state
    return (
      <ImageBackground source={Images.defaults.dots} style={{ width: '100%', height: '100%' }}>
        <LinearGradient colors={[$siTransparent, $siDarkBlue]} style={{ width: '100%', height: '100%' }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.35 }}>
          <ScrollContentView style={styles.container}>
            <View style={styles.contentContainer}>
              <Text style={[text.h1, styles.h1]}>
                {I18n.t('text_login')}
              </Text>
              <TextInput
                value={this.state.username}
                error={usernameError}
                onChangeText={this.onUsernameChange}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputStyle}
                placeholder={I18n.t('text_placeholder_your_username')}
                keyboardType={'default'}
                returnKeyType="next"
                autoCapitalize="none"
                textContentType="username"
                autoCompleteType="username"
                onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_PASSWORD)}
                inputRef={this.handleInputRef(FORM_KEY_USERNAME)}/>
              <TextInput
                value={this.state.password}
                error={passwordError}
                onChangeText={this.onPasswordChange}
                style={styles.password}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputStyle}
                placeholder={I18n.t('text_placeholder_enter_password')}
                keyboardType={'default'}
                returnKeyType="go"
                autoCapitalize="none"
                textContentType="password"
                autoCompleteType="password"
                secureTextEntry={true}
                onSubmitEditing={this.onSubmit}
                inputRef={this.handleInputRef(FORM_KEY_PASSWORD)}/>
              {/* {error && <View style={styles.redBalloon}><Text style={styles.redBalloonText}>{error}</Text><Image resizeMode='center' style={styles.attention} source={Images.defaults.attention} /></View>} */}
              <TextButton
                  style={[button.primary, button.fullWidth, styles.loginButton]}
                  textStyle={button.primaryText}
                  onPress={this.onSubmit}
                  isLoading={isLoading}>
                {I18n.t('caption_login').toUpperCase()}
              </TextButton>
              <TouchableOpacity style={[text.mediumText, styles.forgotPasswordLink]} onPress={() => this.props.navigation.navigate(PasswordReset)}>
                <Text style={[text.mediumText]}>
                  {I18n.t('caption_forgot_password')} {'›'}
                </Text>
              </TouchableOpacity>
              <EulaLink mode="LOGIN" />
            </View>
          </ScrollContentView>
        </LinearGradient>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state: any) => ({
  isNetworkConnected: isNetworkConnected(state),
})

export default connect(
  mapStateToProps,
  { fetchUserInfo, login, syncEventList, loadMarkProperties })(
  Login)
