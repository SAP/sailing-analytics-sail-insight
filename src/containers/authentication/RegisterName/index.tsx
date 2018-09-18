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
import { $primaryButtonColor } from 'styles/colors'
import { button, container, image, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $containerFixedMargin } from 'styles/dimensions'
import styles from './styles'

import FormTextInput from 'components/form/FormTextInput'
import IconText from 'components/IconText'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'


class RegisterName extends React.Component<{
  valid?: boolean,
  isStepValid: boolean,
} > {

  public onSubmit = () => {
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
      <ScrollContentView
        extraHeight={$containerFixedMargin * 3}
      >
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
  isStepValid: !getFieldError(state, REGISTRATION_FORM_NAME, FORM_KEY_NAME),
})

export default connect(
  mapStateToProps,
)(reduxForm({
  form: REGISTRATION_FORM_NAME,
  enableReinitialize: true,
  destroyOnUnmount: false,
  initialValues: {},
  forceUnregisterOnUnmount: true,
})((props: any) => <RegisterName {...props}/>))
