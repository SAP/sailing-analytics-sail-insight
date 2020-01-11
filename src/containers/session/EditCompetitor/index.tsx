import React, { ChangeEvent } from 'react'
import { KeyboardType, NativeSyntheticEvent, ReturnKeyType, TextInputChangeEventData, View } from 'react-native'
import { connect } from 'react-redux'
import { Field, Fields, reduxForm } from 'redux-form'

import { registerCompetitorAndDevice } from 'actions/sessions'
import * as competitorForm from 'forms/competitor'
import * as sessionForm from 'forms/session'
import Logger from 'helpers/Logger'
import I18n from 'i18n'
import { CheckIn, CompetitorInfo, TeamTemplate } from 'models'
import { getDefaultHandicap } from 'models/TeamTemplate'
import { navigateToSessions } from 'navigation'
import { getCustomScreenParamData } from 'navigation/utils'
import { getUserInfo, isLoggedIn } from 'selectors/auth'
import { getLastUsedTeam, getUserTeams } from 'selectors/user'

import TextInputForm from 'components/base/TextInputForm'
import FormTeamPicker from 'components/form/FormTeamPicker'
import FormTextInput from 'components/form/FormTextInput'
import ImageButton from 'components/ImageButton'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'


import { validateRequired } from 'forms/validators'
import { button, container, input, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import Images from '../../../../assets/Images'
import FormBoatClassInput from '../../../components/form/FormBoatClassInput'
import FormHandicapInput from '../../../components/form/FormHandicapInput'
import FormImagePicker from '../../../components/form/FormImagePicker'
import FormNationalityPicker from '../../../components/form/FormNationalityPicker'
import { getFormFieldValue } from '../../../selectors/form'
import { getDeviceCountryIOC } from '../../../services/CheckInService'
import styles from './styles'

interface Props {
  teams: TeamTemplate[]
  registerCompetitorAndDevice: (data: any, values: any) => any
  checkInData: CheckIn,
  isLoggedIn: boolean,
  formSailNumber?: string,
}

class EditCompetitor extends TextInputForm<Props> {

  public state = { isLoading: false }

  private commonProps = {
    keyboardType: 'default' as KeyboardType,
    returnKeyType: 'next' as ReturnKeyType
  }

  public render() {
    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <Field
          name={sessionForm.FORM_KEY_TEAM_IMAGE}
          component={FormImagePicker}
          placeholder={Images.header.team}
        />
        <View style={[container.stretchContent, container.mediumHorizontalMargin]}>
          <Text style={registration.claim()}>
            <Text>{I18n.t('text_edit_competitor_claim_01')}</Text>
            <Text style={text.claimHighlighted}>{I18n.t('text_edit_competitor_claim_02')}</Text>
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <Field
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            style={input.topMargin}
            label={I18n.t('text_your_name')}
            name={sessionForm.FORM_KEY_NAME}
            component={FormTextInput}
            onSubmitEditing={this.handleInputRef(sessionForm.FORM_KEY_TEAM_NAME)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_NAME)}
          />
          <Fields
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            style={input.topMargin}
            label={I18n.t('text_team')}
            names={[
              sessionForm.FORM_KEY_TEAM_NAME,
              sessionForm.FORM_KEY_BOAT_NAME,
              sessionForm.FORM_KEY_BOAT_CLASS,
              sessionForm.FORM_KEY_SAIL_NUMBER,
              sessionForm.FORM_KEY_NATIONALITY,
              sessionForm.FORM_KEY_BOAT_ID,
              sessionForm.FORM_KEY_TEAM_IMAGE,
              sessionForm.FORM_KEY_HANDICAP,
            ]}
            component={FormTeamPicker}
            teams={this.props.teams}
            isLoggedIn={this.props.isLoggedIn}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_BOAT_CLASS)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_TEAM_NAME)}
            {...this.commonProps}
          />
          <Field
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            style={input.topMargin}
            label={I18n.t('text_placeholder_boat_class')}
            name={sessionForm.FORM_KEY_BOAT_CLASS}
            component={FormBoatClassInput}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_NATIONALITY)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_BOAT_CLASS)}
            {...this.commonProps}
          />
          <Field
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            style={input.topMargin}
            label={I18n.t('text_nationality')}
            name={sessionForm.FORM_KEY_NATIONALITY}
            component={FormNationalityPicker}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_SAIL_NUMBER)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_NATIONALITY)}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            style={input.topMargin}
            label={I18n.t('text_placeholder_sail_number')}
            name={sessionForm.FORM_KEY_SAIL_NUMBER}
            component={FormTextInput}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_BOAT_NAME)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_SAIL_NUMBER)}
            {...this.commonProps}
          />
          <Field
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            style={input.topMargin}
            label={I18n.t('text_placeholder_boat_name')}
            name={sessionForm.FORM_KEY_BOAT_NAME}
            component={FormTextInput}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_BOAT_NAME)}
            {...this.commonProps}
          />
          <Field
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            style={input.topMargin}
            label={I18n.t('text_handicap_label')}
            name={sessionForm.FORM_KEY_HANDICAP}
            component={FormHandicapInput}
          />
          <TextButton
            style={[registration.nextButton(), styles.bottomButton]}
            textStyle={button.actionText}
            onPress={this.props.handleSubmit(this.onSubmit)}
            isLoading={this.state.isLoading}
          >
            {I18n.t('caption_accept')}
          </TextButton>
        </View>
        <ImageButton
            style={[button.closeButton, styles.closeButton]}
            source={Images.actions.close}
            onPress={navigateToSessions}
        />
      </ScrollContentView>
    )
  }

  protected handleNationalityChanged = (event?: ChangeEvent<any> | NativeSyntheticEvent<TextInputChangeEventData>,
                                        newValue?: any, previousValue?: any) => {
    if (!this.props.formSailNumber || this.props.formSailNumber === previousValue) {
      this.props.change(sessionForm.FORM_KEY_SAIL_NUMBER, newValue)
    }
  }

  private onSubmit = async (values: CompetitorInfo) => {
    try {
      this.setState({ isLoading: true })
      await this.props.registerCompetitorAndDevice(this.props.checkInData, values)
      return true
    } catch (err) {
      Logger.debug(err)
      return false
    } finally {
      this.setState({ isLoading: false })
    }
  }
}

const mapStateToProps = (state: any, props: any) => {
  const userInfo = getUserInfo(state)
  const lastUsedTeam = getLastUsedTeam(state)
  return {
    initialValues: {
      name: userInfo && userInfo.fullName,
      teamName: (lastUsedTeam && lastUsedTeam.name) || I18n.t('text_default_value_team_name'),
      boatClass: (lastUsedTeam && lastUsedTeam.boatClass),
      boatName: (lastUsedTeam && lastUsedTeam.boatName) || I18n.t('text_default_value_boat_name'),
      sailNumber: (lastUsedTeam && lastUsedTeam.sailNumber) || I18n.t('text_default_value_sail_number'),
      boatId: (lastUsedTeam && lastUsedTeam.id),
      nationality: (lastUsedTeam && lastUsedTeam.nationality) || getDeviceCountryIOC(),
      teamImage: lastUsedTeam && lastUsedTeam.imageData,
      handicap: (lastUsedTeam && lastUsedTeam.handicap) || getDefaultHandicap(),
    } as CompetitorInfo,
    teams: getUserTeams(state),
    checkInData: getCustomScreenParamData(props),
    isLoggedIn: isLoggedIn(state),
    formSailNumber: getFormFieldValue(competitorForm.COMPETITOR_FORM_NAME, sessionForm.FORM_KEY_SAIL_NUMBER)(state),
  }
}


export default connect(mapStateToProps, { registerCompetitorAndDevice })(reduxForm<{}, Props>({
  form: competitorForm.COMPETITOR_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  validate: competitorForm.validate,
})(EditCompetitor))
