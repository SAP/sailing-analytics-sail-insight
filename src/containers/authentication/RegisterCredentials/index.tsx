import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import { FORM_KEY_EMAIL, FORM_KEY_PASSWORD, REGISTRATION_FORM_NAME } from 'forms/registration'
import { validateEmail, validateRequired } from 'forms/validators'
import I18n from 'i18n'
import { navigateToUserRegistrationBoat } from 'navigation'
import { getFieldError } from 'selectors/form'
import { button, container, text } from 'styles/commons'
import { $containerFixedMargin } from 'styles/dimensions'
import styles from './styles'

import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'


class RegisterCredentials extends React.Component<{
  navigation: any,
  valid?: boolean,
  isStepValid: boolean,
} > {
  public inputs: any = {}

  public onSubmit = () => {
    if (this.props.isStepValid) {
      // TODO: API create user, reset navigation to remove previous steps
      navigateToUserRegistrationBoat()
    }
  }

  public handleInputRef = (name: string) => (ref: any) => {
    this.inputs[name] = ref
  }

  public handleOnSubmit = (nextName: string) => () => {
    const nextInput = this.inputs[nextName]
    return nextInput && nextInput.focus && nextInput.focus()
  }

  public render() {
    return (
      <ScrollContentView
        extraHeight={$containerFixedMargin * 3}
      >
        <View style={container.stretchContent}>
          <Text style={[text.claim, styles.claim, container.mediumHorizontalMargin]}>
            <Text>{I18n.t('text_register_credentials_claim_01')}</Text>
            <Text style={text.claimHighlighted}>{I18n.t('text_register_credentials_claim_02')}</Text>
          </Text>
          <Text style={[container.mediumHorizontalMargin, styles.taskText]}>
            {I18n.t('text_registration_create_account')}
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <Field
            label={I18n.t('text_placeholder_your_email')}
            name={FORM_KEY_EMAIL}
            component={FormTextInput}
            validate={[validateRequired, validateEmail]}
            keyboardType={'email-address'}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmit(FORM_KEY_PASSWORD)}
            inputRef={this.handleInputRef(FORM_KEY_EMAIL)}
          />
          <Field
            style={styles.password}
            label={I18n.t('text_placeholder_enter_password')}
            name={FORM_KEY_PASSWORD}
            component={FormTextInput}
            validate={[validateRequired]}
            keyboardType={'default'}
            returnKeyType="go"
            onSubmitEditing={this.onSubmit}
            secureTextEntry={true}
            inputRef={this.handleInputRef(FORM_KEY_PASSWORD)}
          />
          <TextButton
            style={[button.actionFullWidth, container.mediumHorizontalMargin, styles.nextButton]}
            textStyle={button.actionText}
            onPress={this.onSubmit}
          >
            {I18n.t('caption_create_account')}
          </TextButton>
        </View>
      </ScrollContentView >
    )
  }
}

const mapStateToProps = (state: any, props: any) => ({
  isStepValid:
    !getFieldError(state, REGISTRATION_FORM_NAME, FORM_KEY_EMAIL) &&
    !getFieldError(state, REGISTRATION_FORM_NAME, FORM_KEY_PASSWORD),
})

export default connect(
  mapStateToProps,
)(reduxForm({
  form: REGISTRATION_FORM_NAME,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(RegisterCredentials))
