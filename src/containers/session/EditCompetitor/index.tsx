import React from 'react'
import { KeyboardType, ReturnKeyType, View } from 'react-native'
import { connect } from 'react-redux'
import { Field, Fields, reduxForm } from 'redux-form'

import { registerCompetitorAndDevice } from 'actions/sessions'
import * as competitorForm from 'forms/competitor'
import * as sessionForm from 'forms/session'
import { validateRequired } from 'forms/validators'
import Logger from 'helpers/Logger'
import I18n from 'i18n'
import { BoatTemplate, CheckIn, CompetitorInfo } from 'models'
import { getCustomScreenParamData } from 'navigation/utils'
import { getUserInfo } from 'selectors/auth'
import { getLastUsedBoat, getUserBoats } from 'selectors/user'

import TextInputForm from 'components/base/TextInputForm'
import FormBoatPicker from 'components/form/FormBoatPicker'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { button, container, input, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import FormBoatClassInput from '../../../components/form/FormBoatClassInput'
import FormNationalityPicker from '../../../components/form/FormNationalityPicker'
import { getDeviceCountryIOC } from '../../../services/CheckInService'


interface Props {
  boats: BoatTemplate[]
  registerCompetitorAndDevice: (data: any, values: any) => any
  checkInData: CheckIn
}

class EditCompetitor extends TextInputForm<Props> {

  public state = { isLoading: false }

  private commonProps = {
    keyboardType: 'default' as KeyboardType,
    returnKeyType: 'next' as ReturnKeyType,
    validate: [validateRequired],
  }

  public render() {
    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={[container.stretchContent, container.largeHorizontalMargin]}>
          <Text style={registration.claim()}>
            <Text>{I18n.t('text_edit_competitor_claim_01')}</Text>
            <Text style={text.claimHighlighted}>{I18n.t('text_edit_competitor_claim_02')}</Text>
          </Text>
        </View>
        <View style={registration.bottomContainer()}>
          <Field
            style={input.topMargin}
            label={I18n.t('text_your_name')}
            name={'name'}
            component={FormTextInput}
            onSubmitEditing={this.handleInputRef(sessionForm.FORM_KEY_BOAT_NAME)}
            inputRef={this.handleInputRef('name')}
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
            {...this.commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_sail_number')}
            name={sessionForm.FORM_KEY_SAIL_NUMBER}
            component={FormTextInput}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_BOAT_CLASS)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_SAIL_NUMBER)}
            {...this.commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_boat_class')}
            name={sessionForm.FORM_KEY_BOAT_CLASS}
            component={FormBoatClassInput}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_NATIONALITY)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_BOAT_CLASS)}
            {...this.commonProps}
          />
          <Field
              style={input.topMargin}
              label={I18n.t('text_nationality')}
              name={sessionForm.FORM_KEY_NATIONALITY}
              component={FormNationalityPicker}
              onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_TEAM_NAME)}
              inputRef={this.handleInputRef(sessionForm.FORM_KEY_NATIONALITY)}
              {...this.commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_team_name')}
            name={sessionForm.FORM_KEY_TEAM_NAME}
            component={FormTextInput}
            onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_PRIVACY_SETTING)}
            inputRef={this.handleInputRef(sessionForm.FORM_KEY_TEAM_NAME)}
            {...this.commonProps}
          />
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.props.handleSubmit(this.onSubmit)}
            isLoading={this.state.isLoading}
          >
            {I18n.t('caption_accept')}
          </TextButton>
        </View>
      </ScrollContentView >
    )
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
  const lastUsedBoat = getLastUsedBoat(state)
  return {
    initialValues: {
      name: userInfo && userInfo.fullName,
      ...(lastUsedBoat && {
        boatClass: lastUsedBoat.boatClass,
        boatId: lastUsedBoat.id,
        boatName: lastUsedBoat.name,
        sailNumber: lastUsedBoat.sailNumber,
      }),
      nationality: getDeviceCountryIOC(),
      teamName: I18n.t('text_default_value_team_name'),
    } as CompetitorInfo,
    boats: getUserBoats(state),
    checkInData: getCustomScreenParamData(props),
  }
}


export default connect(mapStateToProps, { registerCompetitorAndDevice })(reduxForm<{}, Props>({
  form: competitorForm.COMPETITOR_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  validate: competitorForm.validate,
})(EditCompetitor))
