import React from 'react'
import { KeyboardType, View } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import { saveBoat, SaveBoatAction } from 'actions/user'
import {
  BOAT_FORM_NAME,
  FORM_KEY_BOAT_CLASS,
  FORM_KEY_NAME,
  FORM_KEY_SAIL_NUMBER,
} from 'forms/boat'
import { validateRequired } from 'forms/validators'
import { getErrorDisplayMessage } from 'helpers/texts'
import I18n from 'i18n'
import { BoatTemplate } from 'models'
import { navigateBack } from 'navigation'

import TextInputForm from 'components/base/TextInputForm'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { button, container, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import FormBoatClassInput from '../../../components/form/FormBoatClassInput'
import styles from './styles'


interface Props {
  saveBoat: SaveBoatAction
}

class RegisterBoat extends TextInputForm<Props> {

  public state = { error: null, isLoading: false }

  private commonProps = {
    validate: [validateRequired],
    keyboardType: 'default' as KeyboardType,
    component: FormTextInput,
  }

  public render() {
    const { error, isLoading } = this.state
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
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_BOAT_CLASS)}
            inputRef={this.handleInputRef(FORM_KEY_NAME)}
            {...this.commonProps}
          />
          <Field
            style={styles.inputMargin}
            label={I18n.t('text_placeholder_boat_class')}
            name={FORM_KEY_BOAT_CLASS}
            component={FormBoatClassInput}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_SAIL_NUMBER)}
            hint={I18n.t('text_registration_boat_class_hint')}
            inputRef={this.handleInputRef(FORM_KEY_BOAT_CLASS)}
            {...this.commonProps}
          />
          <Field
            style={styles.inputMargin}
            label={I18n.t('text_placeholder_sail_number')}
            name={FORM_KEY_SAIL_NUMBER}
            returnKeyType="go"
            onSubmitEditing={this.props.handleSubmit(this.onSubmit)}
            hint={I18n.t('text_registration_sail_number_hint')}
            inputRef={this.handleInputRef(FORM_KEY_SAIL_NUMBER)}
            {...this.commonProps}
          />
          {error && <Text style={registration.errorText()}>{error}</Text>}
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.props.handleSubmit(this.onSubmit)}
            isLoading={isLoading}
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
  protected onSkip() {
    navigateBack()
  }

  protected onSubmit = async (values: any) => {
    try {
      this.setState({ isLoading: true, error: null })
      await this.props.saveBoat({
        name: values[FORM_KEY_NAME],
        boatClass: values[FORM_KEY_BOAT_CLASS],
        sailNumber: values[FORM_KEY_SAIL_NUMBER],
      } as BoatTemplate)
      navigateBack()
    } catch (err) {
      this.setState({ error: getErrorDisplayMessage(err) })
    } finally {
      this.setState({ isLoading: false })
    }
  }
}

export default connect(null, { saveBoat })(reduxForm<{}, Props>({
  form: BOAT_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})(RegisterBoat))
