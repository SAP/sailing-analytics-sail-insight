import { connectActionSheet } from '@expo/react-native-action-sheet'
import { isEmpty } from 'lodash'
import React from 'react'
import { Image, ImageBackground, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import { register, RegisterActionType } from 'actions/auth'
import * as registrationForm from 'forms/registration'
import { validateEmail, validatePassword, validateUsername } from 'forms/validators'
import { helpActionSheetOptions } from 'helpers/actionSheets'
import { getErrorDisplayMessage } from 'helpers/texts'
import I18n from 'i18n'
import { navigateToLogin, navigateToUserRegistrationBoat } from 'navigation'

import TextInputForm from 'components/base/TextInputForm'
import EulaLink from 'components/EulaLink'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import Images from '../../../../assets/Images'
import styles from './styles'


interface Props extends NavigationScreenProps {
  register: RegisterActionType
  showActionSheetWithOptions: any
}

@connectActionSheet
class RegisterCredentials extends TextInputForm<Props> {

  public state = {
    error: null,
    isLoading: false,
  }

  public componentDidMount() {
    this.props.navigation.setParams({
      onOptionsPressed: this.onOptionsPressed,
    })
  }

  public onOptionsPressed = () => {
    this.props.showActionSheetWithOptions(...helpActionSheetOptions())
  }

  public render() {
    const { error, isLoading } = this.state
    return (
      <ImageBackground source={Images.defaults.background} style={{ width: '100%', height: '100%' }}>
        <ScrollContentView style={styles.scrollContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.claim}>{I18n.t('text_registration').toUpperCase()}</Text>
          </View>
          <View style={styles.inputField}>
            <Field
              style={styles.textInput}
              containerStyle={styles.inputContainer}
              label={I18n.t('text_name')}
              name={registrationForm.FORM_KEY_NAME}
              component={FormTextInput}
              keyboardType={'default'}
              returnKeyType="next"
              onSubmitEditing={this.handleOnSubmitInput(registrationForm.FORM_KEY_USERNAME)}
              inputRef={this.handleInputRef(registrationForm.FORM_KEY_NAME)}
            />
            <Field
              style={styles.textInput}
              containerStyle={styles.inputContainer}
              label={I18n.t('text_placeholder_your_username')}
              name={registrationForm.FORM_KEY_USERNAME}
              component={FormTextInput}
              keyboardType={'default'}
              returnKeyType="next"
              autoCapitalize="none"
              onSubmitEditing={this.handleOnSubmitInput(registrationForm.FORM_KEY_EMAIL)}
              inputRef={this.handleInputRef(registrationForm.FORM_KEY_USERNAME)}
            />
            <Field
              style={styles.lowerTextInput}
              containerStyle={styles.inputContainer}
              label={I18n.t('text_placeholder_email')}
              name={registrationForm.FORM_KEY_EMAIL}
              component={FormTextInput}
              keyboardType={'email-address'}
              returnKeyType="next"
              autoCapitalize="none"
              onSubmitEditing={this.handleOnSubmitInput(registrationForm.FORM_KEY_PASSWORD)}
              inputRef={this.handleInputRef(registrationForm.FORM_KEY_EMAIL)}
            />
            <Field
              style={styles.lowerTextInput}
              containerStyle={styles.inputContainer}
              label={I18n.t('text_placeholder_enter_password')}
              name={registrationForm.FORM_KEY_PASSWORD}
              component={FormTextInput}
              keyboardType={'default'}
              returnKeyType="go"
              onSubmitEditing={this.props.handleSubmit(this.onSubmit)}
              secureTextEntry={true}
              inputRef={this.handleInputRef(registrationForm.FORM_KEY_PASSWORD)}
            />
            <EulaLink/>
            {error && <View style={styles.redBalloon}><Text style={styles.redBalloonText}>{error}</Text><Image resizeMode='center' style={styles.attention} source={Images.defaults.attention} /></View>}
          </View>
          <View style={styles.bottomButtonField}>
            <TextButton
              style={styles.registrationButton}
              textStyle={styles.registrationButtonText}
              onPress={this.props.handleSubmit(this.onSubmit)}
              isLoading={isLoading}
            >
              {I18n.t('caption_register').toUpperCase()}
            </TextButton>
            <Text onPress={navigateToLogin} style={styles.loginText}>
              {I18n.t('text_login_already_account')}
            </Text>
          </View>
        </ScrollContentView >
      </ImageBackground>
    )
  }

  protected onSubmit = async (values: any) => {
    this.setState({ error: null })

    // custom validation
    let errorMsg = null
    // name check
    if (isEmpty(values[registrationForm.FORM_KEY_NAME])) {
      errorMsg = this.concatMsg(errorMsg, I18n.t('error_need_name'))
    }
    // username check
    if (isEmpty(values[registrationForm.FORM_KEY_USERNAME])) {
      errorMsg = this.concatMsg(errorMsg, I18n.t('error_need_username'))
    } else {
      errorMsg = this.concatMsg(errorMsg, validateUsername(values[registrationForm.FORM_KEY_USERNAME]))
    }
    // email check
    if (isEmpty(values[registrationForm.FORM_KEY_EMAIL])) {
      errorMsg = this.concatMsg(errorMsg, I18n.t('error_need_email'))
    } else {
      errorMsg = this.concatMsg(errorMsg, validateEmail(values[registrationForm.FORM_KEY_EMAIL]))
    }
    // password check
    if (isEmpty(values[registrationForm.FORM_KEY_PASSWORD])) {
      errorMsg = this.concatMsg(errorMsg, I18n.t('error_need_password'))
    } else {
      errorMsg = this.concatMsg(errorMsg, validatePassword(values[registrationForm.FORM_KEY_PASSWORD]))
    }

    if (errorMsg != null) {
      this.setState({ error: errorMsg })
      return
    }

    // try to login
    try {
      this.setState({ isLoading: true })
      await this.props.register(
        values[registrationForm.FORM_KEY_USERNAME],
        values[registrationForm.FORM_KEY_EMAIL],
        values[registrationForm.FORM_KEY_PASSWORD],
        values[registrationForm.FORM_KEY_NAME],
      )
      navigateToUserRegistrationBoat()
    } catch (err) {
      this.setState({ error: getErrorDisplayMessage(err) })
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
