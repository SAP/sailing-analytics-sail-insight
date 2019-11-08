import React from 'react'
import { Image, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import Images from '@assets/Images'
import { FORM_KEY_NAME, REGISTRATION_FORM_NAME } from 'forms/registration'
import { validateRequired } from 'forms/validators'
import { openEmailToContact } from 'helpers/user'
import I18n from 'i18n'
import { navigateToUserRegistrationCredentials } from 'navigation'
import { getFieldError } from 'selectors/form'

import TextInputForm from 'components/base/TextInputForm'
import FormTextInput from 'components/form/FormTextInput'
import LoginButton from 'components/LoginButton'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { button, container, image, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import styles from './styles'


class RegisterName extends TextInputForm {
  public onSubmit = () => {
    this.props.touch(FORM_KEY_NAME)
    if (this.props.isStepValid) {
      navigateToUserRegistrationCredentials()
    }
  }

  public render() {
    return (
      <ImageBackground source={Images.defaults.background} style={{ width: '100%', height: '100%' }}>
        <ScrollContentView extraHeight={$extraSpacingScrollContent}>
          <View style={container.stretchContent}>
            <View style={[registration.topContainer(), styles.textContainer]}>
              <Text style={registration.claim()}>
                <Text>{I18n.t('text_register_claim_01')}</Text>
                <Text style={text.claimHighlighted}>{I18n.t('text_register_claim_02')}</Text>
              </Text>
            </View>
          </View>
          <View style={registration.bottomContainer()}>
            <Field
              label={I18n.t('text_user_name')}
              name={FORM_KEY_NAME}
              component={FormTextInput}
              validate={[validateRequired]}
              keyboardType={'default'}
              returnKeyType="next"
              inputRef={this.handleInputRef(FORM_KEY_NAME)}
              onSubmitEditing={this.onSubmit}
            />
            <TextButton
              style={registration.nextButton()}
              textStyle={button.actionText}
              onPress={this.onSubmit}
            >
              {I18n.t('caption_register').toUpperCase()}
            </TextButton>
            <LoginButton style={styles.loginButton}/>
            <TextButton
              style={registration.lowerButton()}
              textStyle={button.textButtonSecondaryText}
              onPress={openEmailToContact}
            >
              {I18n.t('caption_need_help')}
            </TextButton>
          </View>
        </ScrollContentView >
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state: any, props: any) => ({
  isStepValid: !getFieldError(REGISTRATION_FORM_NAME, FORM_KEY_NAME)(state),
})

export default connect(
  mapStateToProps,
)(reduxForm({
  form: REGISTRATION_FORM_NAME,
  enableReinitialize: true,
  destroyOnUnmount: false,
  initialValues: {},
  forceUnregisterOnUnmount: true,
})(RegisterName))
