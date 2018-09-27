import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import * as sessionForm from 'forms/session'
import { validateRequired } from 'forms/validators'
import I18n from 'i18n'
import { navigateBack } from 'navigation'

import TextInputForm from 'components/base/TextInputForm'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { button, container, input, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'


class EditSession extends TextInputForm {

  public render() {

    const commonProps = {
      keyboardType: 'default',
      returnKeyType: 'next',
    }

    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={[container.stretchContent, container.mediumHorizontalMargin]}>
          <Text style={registration.claim()}>
            <Text>{I18n.t('text_edit_session_claim_01')}</Text>
            <Text style={text.claimHighlighted}>{I18n.t('text_edit_session_claim_02')}</Text>
          </Text>
        </View>
        <View style={registration.bottomContainer()}>
          <Field
            label={I18n.t('text_placeholder_session_name')}
            name={sessionForm.FORM_KEY_NAME}
            validate={[validateRequired]}
            component={this.renderField}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_TRACK_NAME)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_NAME)}
            {...commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_track_name')}
            name={sessionForm.FORM_KEY_TRACK_NAME}
            validate={[validateRequired]}
            component={this.renderField}
            onSubmitEditing={this.handleInputRef(sessionForm.FORM_KEY_BOAT_NAME)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_TRACK_NAME)}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_boat_name')}
            name={sessionForm.FORM_KEY_BOAT_NAME}
            component={this.renderField}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_SAIL_NUMBER)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_BOAT_NAME)}
            {...commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_sail_number')}
            name={sessionForm.FORM_KEY_SAIL_NUMBER}
            component={this.renderField}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_BOAT_CLASS)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_SAIL_NUMBER)}
            {...commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_boat_class')}
            name={sessionForm.FORM_KEY_BOAT_CLASS}
            component={this.renderField}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_TEAM_NAME)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_BOAT_CLASS)}
            {...commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_team_name')}
            name={sessionForm.FORM_KEY_TEAM_NAME}
            component={this.renderField}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_PRIVACY_SETTING)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_TEAM_NAME)}
            {...commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_privacy_setting')}
            name={sessionForm.FORM_KEY_PRIVACY_SETTING}
            component={this.renderField}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_PRIVACY_SETTING)}
            {...commonProps}
          />
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.onSubmit}
          >
            {I18n.t('caption_accept')}
          </TextButton>
        </View>
      </ScrollContentView >
    )
  }
  protected renderField(props: any) {
    return <FormTextInput {...props}/>
  }

  private onSubmit = () => {
    navigateBack()
  }
}

export default connect()(reduxForm({
  form: sessionForm.SESSION_FORM_NAME,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(EditSession))
