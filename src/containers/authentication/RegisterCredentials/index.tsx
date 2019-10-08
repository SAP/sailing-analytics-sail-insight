import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { ImageBackground, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import { register, RegisterActionType } from 'actions/auth'
import * as registrationForm from 'forms/registration'
import { validateEmail, validatePassword, validateRequired, validateUsername } from 'forms/validators'
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

import { registration } from 'styles/components'

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
              validate={[validateRequired]}
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
              validate={[validateRequired, validateUsername]}
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
              validate={[validateRequired, validateEmail]}
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
              validate={[validateRequired, validatePassword]}
              keyboardType={'default'}
              returnKeyType="go"
              onSubmitEditing={this.props.handleSubmit(this.onSubmit)}
              secureTextEntry={true}
              inputRef={this.handleInputRef(registrationForm.FORM_KEY_PASSWORD)}
            />
            <EulaLink/>
            {error && <Text style={registration.errorText()}>{error}</Text>}
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
    try {
      this.setState({ isLoading: true, error: null })
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
}

export default connect(
  null,
  { register },
)(reduxForm<{}, Props>({
  form: registrationForm.REGISTRATION_FORM_NAME,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(RegisterCredentials))
