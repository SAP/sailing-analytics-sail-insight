import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import {
  BOAT_FORM_NAME,
  FORM_KEY_BOAT_CLASS,
  FORM_KEY_NAME,
  FORM_KEY_SAIL_NUMBER,
} from 'forms/boat'
import { validateRequired } from 'forms/validators'
import I18n from 'i18n'
import { navigateBack } from 'navigation'
import { getFieldError } from 'selectors/form'

import TextInputForm from 'components/base/TextInputForm'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import { registration } from 'styles/components'

import { button, container, text } from 'styles/commons'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import styles from './styles'


class RegisterBoat extends TextInputForm {
  public onSkip() {
    navigateBack()
  }

  public onSubmit = () => {
    this.props.touch(FORM_KEY_NAME, FORM_KEY_BOAT_CLASS, FORM_KEY_SAIL_NUMBER)
    if (this.props.isStepValid) {
      // TODO: update API user with boat information and create boat
      // TODO: navigate back, finalize form
    }
  }

  public renderField(props: any) {
    return <FormTextInput {...props}/>
  }

  public render() {
    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={[container.stretchContent, container.largeHorizontalMargin]}>
          <Text style={registration.claim()}>
            <Text>{I18n.t('text_register_boat_claim_01')}</Text>
            <Text style={text.claimHighlighted}>{I18n.t('text_register_boat_claim_02')}</Text>
          </Text>
        </View>
        <View style={registration.bottomContainer()}>
          <Field
            label={I18n.t('text_placeholder_boat_name')}
            name={FORM_KEY_NAME}
            component={this.renderField}
            validate={[validateRequired]}
            keyboardType={'default'}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_BOAT_CLASS)}
            inputRef={this.handleInputRef(FORM_KEY_NAME)}
          />
          <Field
            style={styles.inputMargin}
            label={I18n.t('text_placeholder_boat_class')}
            name={FORM_KEY_BOAT_CLASS}
            component={this.renderField}
            validate={[validateRequired]}
            keyboardType={'default'}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_SAIL_NUMBER)}
            hint={I18n.t('text_registration_boat_class_hint')}
            inputRef={this.handleInputRef(FORM_KEY_BOAT_CLASS)}
          />
          <Field
            style={styles.inputMargin}
            label={I18n.t('text_placeholder_sail_number')}
            name={FORM_KEY_SAIL_NUMBER}
            component={this.renderField}
            validate={[validateRequired]}
            keyboardType={'default'}
            returnKeyType="go"
            onSubmitEditing={this.onSubmit}
            hint={I18n.t('text_registration_sail_number_hint')}
            inputRef={this.handleInputRef(FORM_KEY_SAIL_NUMBER)}
          />
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.onSubmit}
          >
            {I18n.t('caption_add_boat')}
          </TextButton>
          <TextButton
            style={registration.lowerButton()}
            textStyle={button.textButtonSecondaryText}
            onPress={this.onSkip}
          >
            {I18n.t('caption_skip')}
          </TextButton>
        </View>
      </ScrollContentView >
    )
  }
}

const mapStateToProps = (state: any, props: any) => ({
  isStepValid:
    !getFieldError(BOAT_FORM_NAME, FORM_KEY_BOAT_CLASS)(state) &&
    !getFieldError(BOAT_FORM_NAME, FORM_KEY_SAIL_NUMBER)(state) &&
    !getFieldError(BOAT_FORM_NAME, FORM_KEY_NAME)(state),
})

export default connect(
  mapStateToProps,
)(reduxForm({
  form: BOAT_FORM_NAME,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(RegisterBoat))
