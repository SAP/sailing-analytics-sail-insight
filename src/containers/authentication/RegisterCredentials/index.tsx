import React from 'react'
import { View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { NavigationScreenProps } from 'react-navigation'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import { isEmpty } from 'lodash'
import LinearGradient from 'react-native-linear-gradient';

import * as Screens from 'navigation/Screens'

import { register, RegisterActionType } from 'actions/auth'

import * as registrationForm from 'forms/registration'
import { validateEmail, validatePassword, validateUsername } from 'forms/validators'

import { getErrorDisplayMessage } from 'helpers/texts'

import I18n from 'i18n'

import EulaLink from 'components/EulaLink'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TextInputForm from 'components/base/TextInputForm'

import Images from '../../../../assets/Images'
import styles from './styles'
import { text, form, button } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

interface Props extends NavigationScreenProps {
  register: RegisterActionType
  showActionSheetWithOptions: any
}

@connectActionSheet
class RegisterCredentials extends TextInputForm<Props> {

  public state = {
    error: null,
    usernameError: null,
    passwordError: null,
    emailError: null,
    isLoading: false
  }

  public render() {
    const { error, usernameError, passwordError, emailError, isLoading } = this.state
    return (
      <ImageBackground source={Images.defaults.dots} style={{ width: '100%', height: '100%' }}>
        <LinearGradient colors={[$siTransparent, $siDarkBlue]} style={{ width: '100%', height: '100%' }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.35 }}>
          <ScrollContentView style={styles.container}>
            <View style={styles.contentContainer}>
              <Text style={[text.h1, styles.h1]}>
                {I18n.t('title_create_account_01')}
                <Text style={text.yellow}>{I18n.t('title_create_account_02')}</Text>
                {I18n.t('title_create_account_03')}
              </Text>
              <View style={form.formSegment1}>
                <Field
                  label={I18n.t('text_placeholder_your_username')}
                  error={usernameError}
                  name={registrationForm.FORM_KEY_USERNAME}
                  component={FormTextInput}
                  keyboardType={'default'}
                  returnKeyType="next"
                  autoCapitalize="none"
                  onSubmitEditing={this.handleOnSubmitInput(registrationForm.FORM_KEY_PASSWORD)}
                  inputRef={this.handleInputRef(registrationForm.FORM_KEY_USERNAME)}
                />
                <Field
                  label={I18n.t('text_placeholder_enter_password')}
                  error={passwordError}
                  name={registrationForm.FORM_KEY_PASSWORD}
                  component={FormTextInput}
                  keyboardType={'default'}
                  returnKeyType="next"
                  autoCapitalize="none"
                  secureTextEntry={true}
                  onSubmitEditing={this.handleOnSubmitInput(registrationForm.FORM_KEY_EMAIL)}
                  inputRef={this.handleInputRef(registrationForm.FORM_KEY_PASSWORD)}
                />
              </View>
              <View style={form.formSegment2}>
                <Field
                  label={I18n.t('text_placeholder_email')}
                  error={emailError}
                  name={registrationForm.FORM_KEY_EMAIL}
                  component={FormTextInput}
                  keyboardType={'email-address'}
                  returnKeyType="go"
                  autoCapitalize="none"
                  onSubmitEditing={this.props.handleSubmit(this.onSubmit)}
                  inputRef={this.handleInputRef(registrationForm.FORM_KEY_EMAIL)}
                />
              </View>
              <View style={form.lastFormSegment}>
                <View style={styles.eulaField}>
                  <EulaLink/>
                </View>
                <TextButton
                  style={[button.primary, button.fullWidth, styles.registerButton]}
                  textStyle={button.primaryText}
                  onPress={this.props.handleSubmit(this.onSubmit)}
                  isLoading={isLoading}>
                    {I18n.t('caption_register').toUpperCase()}
                </TextButton>
                <Text onPress={() => this.props.navigation.navigate(Screens.Login)} style={text.text}>
                  {I18n.t('text_login_already_account')} {'›'}
                </Text>
                {/* {error && <View style={styles.redBalloon}><Text style={styles.redBalloonText}>{error}</Text><Image resizeMode='center' style={styles.attention} source={Images.defaults.attention} /></View>} */}
              </View>
            </View>
          </ScrollContentView>
        </LinearGradient>
      </ImageBackground>
    )
  }

  protected onSubmit = async (values: any) => {
    this.setState({ error: null })

    // custom validation
    let errorMsg = null
    let usernameError = null
    let passwordError = null
    let emailError = null

    // username check
    if (isEmpty(values[registrationForm.FORM_KEY_USERNAME])) {
      usernameError = I18n.t('error_need_username')
    } else {
      usernameError = validateUsername(values[registrationForm.FORM_KEY_USERNAME])
    }
    errorMsg = this.concatMsg(errorMsg, usernameError)

    // password check
    if (isEmpty(values[registrationForm.FORM_KEY_PASSWORD])) {
      passwordError = I18n.t('error_need_password')
    } else {
      passwordError = validatePassword(values[registrationForm.FORM_KEY_PASSWORD])
    }
    errorMsg = this.concatMsg(errorMsg, passwordError)

    // email check
    if (isEmpty(values[registrationForm.FORM_KEY_EMAIL])) {
      emailError = I18n.t('error_need_email')
    } else {
      emailError = validateEmail(values[registrationForm.FORM_KEY_EMAIL])
    }
    errorMsg = this.concatMsg(errorMsg, emailError)

    if (errorMsg != null) {
      this.setState({ error: errorMsg, usernameError, passwordError, emailError })
      return
    }

    // try to login
    try {
      this.setState({ isLoading: true })
      await this.props.register(
        values[registrationForm.FORM_KEY_USERNAME],
        values[registrationForm.FORM_KEY_EMAIL],
        values[registrationForm.FORM_KEY_PASSWORD],
      )
      this.loggedIn = true
      this.props.navigation.navigate(Screens.RegisterBoatAfterRegistration)
      this.props.destroy()
    } catch (err) {
      const errorMessage = getErrorDisplayMessage(err)
      this.setState({ error: errorMessage, usernameError: errorMessage })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  private concatMsg(msg: null | string, msgToAdd: null | string): string | null {
    let concatMsg = null
    if (msgToAdd != null && msg != null) {
      concatMsg = `${msg}\n${msgToAdd}`
    } else if (msgToAdd != null && msg == null) {
      concatMsg = `${msgToAdd}`
    } else if (msgToAdd == null && msg != null) {
      concatMsg = `${msg}`
    }
    return concatMsg
  }
}

export default connect(
  null,
  { register },
)(reduxForm<{}, Props>({
  form: registrationForm.REGISTRATION_FORM_NAME,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(RegisterCredentials))
