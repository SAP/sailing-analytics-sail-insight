import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import { register, RegisterActionType } from 'actions/auth'
import * as registrationForm from 'forms/registration'
import { validateEmail, validateRequired, validateUsername } from 'forms/validators'
import { helpActionSheetOptions } from 'helpers/actionSheets'
import { getErrorDisplayMessage } from 'helpers/texts'
import I18n from 'i18n'
import { navigateToUserRegistrationBoat } from 'navigation'

import TextInputForm from 'components/base/TextInputForm'
import EulaLink from 'components/EulaLink'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { button, container, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
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
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={[container.stretchContent, container.largeHorizontalMargin]}>
          <Text style={registration.claim()}>
            <Text>{I18n.t('text_register_credentials_claim_01')}</Text>
            <Text style={text.claimHighlighted}>{I18n.t('text_register_credentials_claim_02')}</Text>
          </Text>
          <Text style={styles.taskText}>
            {I18n.t('text_registration_create_account')}
          </Text>
        </View>
        <View style={registration.bottomContainer()}>
          <Field
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
            label={I18n.t('text_placeholder_your_email')}
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
            label={I18n.t('text_placeholder_enter_password')}
            name={registrationForm.FORM_KEY_PASSWORD}
            component={FormTextInput}
            validate={[validateRequired]}
            keyboardType={'default'}
            returnKeyType="go"
            onSubmitEditing={this.props.handleSubmit(this.onSubmit)}
            secureTextEntry={true}
            inputRef={this.handleInputRef(registrationForm.FORM_KEY_PASSWORD)}
          />
          <EulaLink/>
          {error && <Text style={registration.errorText()}>{error}</Text>}
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.props.handleSubmit(this.onSubmit)}
            isLoading={isLoading}
          >
            {I18n.t('caption_create_account')}
          </TextButton>
        </View>
      </ScrollContentView >
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
