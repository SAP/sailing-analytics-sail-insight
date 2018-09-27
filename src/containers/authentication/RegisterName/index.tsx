import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import Images from '@assets/Images'
import { FORM_KEY_NAME, REGISTRATION_FORM_NAME } from 'forms/registration'
import { validateRequired } from 'forms/validators'
import I18n from 'i18n'
import { navigateToUserRegistrationCredentials, navitateToLogin } from 'navigation'
import { getFieldError } from 'selectors/form'

import TextInputForm from 'components/base/TextInputForm'
import FormTextInput from 'components/form/FormTextInput'
import IconText from 'components/IconText'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { $primaryButtonColor } from 'styles/colors'
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

  public onLoginPress = () => {
    navitateToLogin()
  }

  public renderField(props: any) {
    return <FormTextInput {...props}/>
  }

  public render() {
    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={container.stretchContent}>
          <Image style={image.headerMedium} source={Images.header.sailors}/>
          <Image style={image.tagLine} source={Images.corporateIdentity.sapTagLine}/>
          <View style={[registration.topContainer(), styles.textContainer]}>
            <Text style={registration.claim()}>
              <Text>{I18n.t('text_register_claim_01')}</Text>
              <Text style={text.claimHighlighted}>{I18n.t('text_register_claim_02')}</Text>
            </Text>
          </View>
        </View>
        <View style={registration.bottomContainer()}>
          <Field
            label={I18n.t('text_your_name')}
            name={FORM_KEY_NAME}
            component={this.renderField}
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
            {I18n.t('caption_lets_go')}
          </TextButton>
          <TouchableOpacity
            onPress={this.onLoginPress}
          >
            <IconText
              style={styles.loginButton}
              source={Images.tabs.account}
              iconTintColor={$primaryButtonColor}
              textStyle={button.textButtonSecondaryText}
              alignment="horizontal"
            >
              {I18n.t('caption_login')}
            </IconText>
          </TouchableOpacity>
          <TextButton
            style={registration.lowerButton()}
            textStyle={button.textButtonSecondaryText}
          >
            {I18n.t('caption_need_help')}
          </TextButton>
        </View>
      </ScrollContentView >
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
