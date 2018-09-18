import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import * as sessionForm from 'forms/session'
import { validateRequired } from 'forms/validators'
import I18n from 'i18n'
import { navigateBack } from 'navigation'
import { button, container, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $containerFixedMargin } from 'styles/dimensions'
import styles from './styles'

import TextInputForm from 'components/base/TextInputForm'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'


class EditSession extends TextInputForm<{
  valid?: boolean,
} > {
  public renderField(props: any) {
    return <FormTextInput {...props}/>
  }

  public render() {
    return (
      <ScrollContentView
        extraHeight={$containerFixedMargin * 3}
      >
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
            component={this.renderField}
            validate={[validateRequired]}
            keyboardType={'default'}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmit(sessionForm.FORM_KEY_TRACK_NAME)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_NAME)}
          />
          <Field
            style={styles.inputMargin}
            label={I18n.t('text_track_name')}
            name={sessionForm.FORM_KEY_TRACK_NAME}
            component={this.renderField}
            validate={[validateRequired]}
            keyboardType={'default'}
            returnKeyType="next"
            onSubmitEditing={this.handleInputRef(sessionForm.FORM_KEY_BOAT_NAME)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_TRACK_NAME)}
          />
          <Field
            style={styles.inputMargin}
            label={I18n.t('text_placeholder_boat_name')}
            name={sessionForm.FORM_KEY_BOAT_NAME}
            component={this.renderField}
            keyboardType={'default'}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmit(sessionForm.FORM_KEY_SAIL_NUMBER)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_BOAT_NAME)}
          />
          <Field
            style={styles.inputMargin}
            label={I18n.t('text_placeholder_sail_number')}
            name={sessionForm.FORM_KEY_SAIL_NUMBER}
            component={this.renderField}
            keyboardType={'default'}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmit(sessionForm.FORM_KEY_BOAT_CLASS)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_SAIL_NUMBER)}
          />
          <Field
            style={styles.inputMargin}
            label={I18n.t('text_placeholder_boat_class')}
            name={sessionForm.FORM_KEY_BOAT_CLASS}
            component={this.renderField}
            keyboardType={'default'}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmit(sessionForm.FORM_KEY_TEAM_NAME)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_BOAT_CLASS)}
          />
          <Field
            style={styles.inputMargin}
            label={I18n.t('text_team_name')}
            name={sessionForm.FORM_KEY_TEAM_NAME}
            component={this.renderField}
            keyboardType={'default'}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmit(sessionForm.FORM_KEY_PRIVACY_SETTING)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_TEAM_NAME)}
          />
          <Field
            style={styles.inputMargin}
            label={I18n.t('text_privacy_setting')}
            name={sessionForm.FORM_KEY_PRIVACY_SETTING}
            component={this.renderField}
            keyboardType={'default'}
            returnKeyType="next"
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_PRIVACY_SETTING)}
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

  private onSubmit = () => {
    navigateBack()
  }
}

export default connect()(reduxForm({
  form: sessionForm.SESSION_FORM_NAME,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})((props: any) => <EditSession {...props}/>))
