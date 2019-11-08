import React, { ChangeEvent } from 'react'
import { KeyboardType, NativeSyntheticEvent, TextInputChangeEventData, View } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import { saveTeam, SaveTeamAction } from 'actions/user'
import {
  FORM_KEY_BOAT_CLASS,
  FORM_KEY_BOAT_NAME,
  FORM_KEY_HANDICAP,
  FORM_KEY_IMAGE,
  FORM_KEY_NATIONALITY,
  FORM_KEY_SAIL_NUMBER,
  FORM_KEY_TEAM_NAME,
  TEAM_FORM_NAME,
} from 'forms/team'
import { validateRequired } from 'forms/validators'
import { getErrorDisplayMessage } from 'helpers/texts'
import I18n from 'i18n'
import { TeamTemplate } from 'models'
import { getDefaultHandicap } from 'models/TeamTemplate'
import { navigateBack } from 'navigation'

import TextInputForm from 'components/base/TextInputForm'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { button, container, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import Images from '../../../../assets/Images'
import FormBoatClassInput from '../../../components/form/FormBoatClassInput'
import FormHandicapInput from '../../../components/form/FormHandicapInput'
import FormImagePicker from '../../../components/form/FormImagePicker'
import FormNationalityPicker from '../../../components/form/FormNationalityPicker'
import { getFormFieldValue } from '../../../selectors/form'
import styles from './styles'


interface Props {
  saveTeam: SaveTeamAction,
  formSailNumber?: string,
}

class RegisterBoat extends TextInputForm<Props> {

  public state = { error: null, isLoading: false }

  private commonProps = {
    keyboardType: 'default' as KeyboardType,
  }

  public render() {
    const { error, isLoading } = this.state
    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <Field
          name={FORM_KEY_IMAGE}
          component={FormImagePicker}
          placeholder={Images.header.team}
        />
        <View style={[container.stretchContent, container.largeHorizontalMargin]}>
          <Text style={registration.claim()}>
            <Text>{I18n.t('text_register_boat_claim_01')}</Text>
            <Text style={text.claimHighlighted}>{I18n.t('text_register_boat_claim_02')}</Text>
          </Text>
        </View>
        <View style={registration.bottomContainer()}>
          <Field
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            label={I18n.t('text_placeholder_team_name')}
            name={FORM_KEY_TEAM_NAME}
            component={FormTextInput}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_BOAT_CLASS)}
            inputRef={this.handleInputRef(FORM_KEY_TEAM_NAME)}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            style={styles.inputMargin}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            label={I18n.t('text_placeholder_boat_class')}
            name={FORM_KEY_BOAT_CLASS}
            component={FormBoatClassInput}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_NATIONALITY)}
            hint={I18n.t('text_registration_boat_class_hint')}
            inputRef={this.handleInputRef(FORM_KEY_BOAT_CLASS)}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            label={I18n.t('text_nationality')}
            name={FORM_KEY_NATIONALITY}
            component={FormNationalityPicker}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_SAIL_NUMBER)}
            inputRef={this.handleInputRef(FORM_KEY_NATIONALITY)}
            onChange={this.handleNationalityChanged}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            style={styles.inputMargin}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            label={I18n.t('text_placeholder_sail_number')}
            name={FORM_KEY_SAIL_NUMBER}
            component={FormTextInput}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_BOAT_NAME)}
            hint={I18n.t('text_registration_sail_number_hint')}
            inputRef={this.handleInputRef(FORM_KEY_SAIL_NUMBER)}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            label={I18n.t('text_placeholder_boat_name')}
            name={FORM_KEY_BOAT_NAME}
            component={FormTextInput}
            returnKeyType="go"
            onSubmitEditing={this.props.handleSubmit(this.onSubmit)}
            inputRef={this.handleInputRef(FORM_KEY_BOAT_NAME)}
            {...this.commonProps}
          />
          <Field
            style={styles.inputMargin}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            label={I18n.t('text_handicap_label')}
            name={FORM_KEY_HANDICAP}
            component={FormHandicapInput}
          />
          {error && <Text style={registration.errorText()}>{error}</Text>}
          <TextButton
            style={[registration.nextButton(), styles.bottomButton]}
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

  protected handleNationalityChanged = (event?: ChangeEvent<any> | NativeSyntheticEvent<TextInputChangeEventData>,
                                        newValue?: any, previousValue?: any) => {
    if (!this.props.formSailNumber || this.props.formSailNumber === previousValue) {
      this.props.change(FORM_KEY_SAIL_NUMBER, newValue)
    }
  }

  protected onSkip() {
    navigateBack()
  }

  protected onSubmit = async (values: any) => {
    try {
      this.setState({ isLoading: true, error: null })
      await this.props.saveTeam({
        name: values[FORM_KEY_TEAM_NAME],
        boatName: values[FORM_KEY_BOAT_NAME],
        nationality: values[FORM_KEY_NATIONALITY],
        boatClass: values[FORM_KEY_BOAT_CLASS],
        sailNumber: values[FORM_KEY_SAIL_NUMBER],
        imageData: values[FORM_KEY_IMAGE],
        handicap: values[FORM_KEY_HANDICAP],
      } as TeamTemplate)
      navigateBack()
    } catch (err) {
      this.setState({ error: getErrorDisplayMessage(err) })
    } finally {
      this.setState({ isLoading: false })
    }
  }
}

const mapStateToProps = (state: any) => ({
  formSailNumber: getFormFieldValue(TEAM_FORM_NAME, FORM_KEY_SAIL_NUMBER)(state),
  initialValues: {
    [FORM_KEY_HANDICAP]: getDefaultHandicap(),
  }
})

export default connect(mapStateToProps, { saveTeam })(reduxForm<{}, Props>({
  form: TEAM_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})(RegisterBoat))
