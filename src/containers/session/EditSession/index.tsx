import React from 'react'
import { KeyboardType, ReturnKeyType, View } from 'react-native'
import { connect } from 'react-redux'
import { Field, Fields, reduxForm } from 'redux-form'

import * as sessionForm from 'forms/session'
import { validateRequired } from 'forms/validators'
import I18n from 'i18n'
import { BoatTemplate } from 'models'
import { navigateBack } from 'navigation'

import TextInputForm from 'components/base/TextInputForm'
import FormBoatPicker from 'components/form/FormBoatPicker'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { getUserBoats } from 'selectors/user'
import { button, container, input, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import FormBoatClassInput from '../../../components/form/FormBoatClassInput'


interface Props {
  boats: BoatTemplate[]
}

class EditSession extends TextInputForm<Props> {

  private commonProps = {
    keyboardType: 'default' as KeyboardType,
    returnKeyType: 'next' as ReturnKeyType,
  }

  public render() {
    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={[container.stretchContent, container.largeHorizontalMargin]}>
          <Text style={registration.claim()}>
            <Text>{I18n.t('text_edit_session_claim_01')}</Text>
            <Text style={text.claimHighlighted}>{I18n.t('text_edit_session_claim_02')}</Text>
          </Text>
        </View>
        <View style={registration.bottomContainer()}>
          <Field
            label={I18n.t('text_placeholder_session_name')}
            name={sessionForm.FORM_KEY_NAME}
            component={FormTextInput}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_TRACK_NAME)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_NAME)}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_track_name')}
            name={sessionForm.FORM_KEY_TRACK_NAME}
            component={FormTextInput}
            onSubmitEditing={this.handleInputRef(sessionForm.FORM_KEY_BOAT_NAME)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_TRACK_NAME)}
          />
          <Fields
            style={input.topMargin}
            label={I18n.t('text_boat')}
            names={[
              sessionForm.FORM_KEY_BOAT_NAME,
              sessionForm.FORM_KEY_BOAT_CLASS,
              sessionForm.FORM_KEY_SAIL_NUMBER,
              sessionForm.FORM_KEY_BOAT_ID,
            ]}
            component={FormBoatPicker}
            boats={this.props.boats}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_SAIL_NUMBER)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_BOAT_NAME)}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_sail_number')}
            name={sessionForm.FORM_KEY_SAIL_NUMBER}
            component={FormTextInput}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_BOAT_CLASS)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_SAIL_NUMBER)}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_boat_class')}
            name={sessionForm.FORM_KEY_BOAT_CLASS}
            component={FormBoatClassInput}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_TEAM_NAME)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_BOAT_CLASS)}
            {...this.commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_team_name')}
            name={sessionForm.FORM_KEY_TEAM_NAME}
            component={FormTextInput}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_PRIVACY_SETTING)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_TEAM_NAME)}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          {/* <Field
            style={input.topMargin}
            label={I18n.t('text_privacy_setting')}
            name={sessionForm.FORM_KEY_PRIVACY_SETTING}
            component={FormTextInput}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_PRIVACY_SETTING)}
            {...this.commonProps}
          /> */}
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

  private onSubmit = () => {
    navigateBack()
  }
}

const mapStateToProps = (state: any) => ({
  boats: getUserBoats(state),
})

export default connect(mapStateToProps)(reduxForm<{}, Props>({
  form: sessionForm.SESSION_FORM_NAME,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: sessionForm.validate,
})(EditSession))
