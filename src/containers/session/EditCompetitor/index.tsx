import React, { ChangeEvent } from 'react'
import { KeyboardType, NativeSyntheticEvent, ReturnKeyType, TextInputChangeEventData, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { Field, Fields, reduxForm } from 'redux-form'
import LinearGradient from 'react-native-linear-gradient'

import { registerCompetitorAndDevice } from 'actions/sessions'

import * as competitorForm from 'forms/competitor'
import * as sessionForm from 'forms/session'
import { validateRequired } from 'forms/validators'

import Logger from 'helpers/Logger'

import { CheckIn, CompetitorInfo, TeamTemplate } from 'models'
import { getDefaultHandicap } from 'models/TeamTemplate'

import { getDeviceCountryIOC } from '../../../services/CheckInService'

import { getCustomScreenParamData, getCustomScreenParamOptions } from 'navigation/utils'

import { getLastUsedTeam, getUserTeams } from 'selectors/user'
import { getRegatta } from 'selectors/regatta'
import { getUserInfo, isLoggedIn } from 'selectors/auth'
import { getFormFieldValue } from '../../../selectors/form'

import FormBoatClassInput from '../../../components/form/FormBoatClassInput'
import FormHandicapInput from '../../../components/form/FormHandicapInput'
import FormImagePicker from '../../../components/form/FormImagePicker'
import FormNationalityPicker from '../../../components/form/FormNationalityPicker'
import FormTeamPicker from 'components/form/FormTeamPicker'
import FormTextInput from 'components/form/FormTextInput'
import ImageButton from 'components/ImageButton'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TextInputForm from 'components/base/TextInputForm'

import I18n from 'i18n'

import Images from '@assets/Images'
import styles from './styles'
import { text, form, button, image, container } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

import { $extraSpacingScrollContent } from 'styles/dimensions'
import { registration } from 'styles/components'

interface Props {
  teams: TeamTemplate[]
  registerCompetitorAndDevice: (data: any, values: any, options?: any, navigation:object) => any
  checkInData: CheckIn,
  isLoggedIn: boolean,
  formSailNumber?: string,
  regatta?: any,
}

class EditCompetitor extends TextInputForm<Props> {

  public state = { isLoading: false, showMore: false }

  private commonProps = {
    keyboardType: 'default' as KeyboardType,
    returnKeyType: 'next' as ReturnKeyType
  }

  private toggleShowMore(e: Event) {
    e.preventDefault();
    this.setState({ showMore: !this.state.showMore })
  }

  public render() {
    const { regatta = {} } = this.props
    const showHandicapInput = regatta?.rankingMetric !== 'ONE_DESIGN'

    return (
      <ImageBackground source={Images.defaults.dots} style={{ width: '100%', height: '100%' }}>
        <LinearGradient colors={[$siTransparent, $siDarkBlue]} style={{ width: '100%', height: '100%' }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.35 }}>
          <ScrollContentView style={styles.container}>
            <View style={styles.contentContainer}>
              <Text style={[text.h1, styles.h1]}>
                {I18n.t('title_add_boat')}
              </Text>
              <Text style={[text.mediumText, styles.introText]}>You can edit this boat or add more at any time by going to the account tab</Text>
              {/* TODO translate */}
              <View style={form.formSegment1}>
                <Field // TODO required
                  hint={I18n.t('text_hint_competitor_name')}
                  label={I18n.t('text_placeholder_competitor_name')}
                  name={sessionForm.FORM_KEY_BOAT_NAME} // TODO: is this the correct string
                  component={FormTextInput}
                  onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_SAIL_NUMBER)}
                  inputRef={this.handleInputRef(sessionForm.FORM_KEY_BOAT_NAME)}
                  {...Object.assign({}, this.commonProps, { textContentType:'name', autoCompleteType:'name' }) } />
                <Field // TODO required
                  label={I18n.t('text_placeholder_sail_number')}
                  name={sessionForm.FORM_KEY_SAIL_NUMBER}
                  component={FormTextInput}
                  onSubmitEditing={this.handleOnSubmitInput(sessionForm.FORM_KEY_BOAT_CLASS)}
                  inputRef={this.handleInputRef(sessionForm.FORM_KEY_SAIL_NUMBER)}
                  {...this.commonProps} />
                <Field // TODO required
                  label={I18n.t('text_placeholder_boat_class')}
                  name={sessionForm.FORM_KEY_BOAT_CLASS}
                  component={FormBoatClassInput}
                  inputRef={this.handleInputRef(sessionForm.FORM_KEY_BOAT_CLASS)}
                  {...Object.assign({}, this.commonProps, { autoCorrect:false }) } />
                   
              </View>
              <View style={form.formDivider}>
                <View style={form.formDividerLine}></View>
                <View style={form.formDividerText}>
                  <TextButton textStyle={form.formDividerButtonText} onPress={this.toggleShowMore.bind(this)}>
                    {I18n.t('text_more').toUpperCase()}
                  </TextButton>
                </View>
                <View style={form.formDividerLine}></View>
              </View>
              { this.state.showMore &&
                <View style={form.formSegment2}>
                  <Field
                    label={I18n.t('text_handicap_label')}
                    name={sessionForm.FORM_KEY_HANDICAP}
                    component={FormHandicapInput} />
                </View>
              }
              <View style={form.lastFormSegment}>
                <TextButton
                  style={[button.primary, button.fullWidth, styles.addBoatButton]}
                  textStyle={button.primaryText}
                  onPress={this.props.handleSubmit(this.onSubmit)}
                  isLoading={this.state.isLoading}>
                    {I18n.t('caption_add_boat').toUpperCase()}
                </TextButton>
              </View>
            </View>
          </ScrollContentView>
        </LinearGradient>
      </ImageBackground>
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
      await this.props.registerCompetitorAndDevice(this.props.checkInData, values, this.props.options, this.props.navigation)
      return true
    } catch (err) {
      Logger.debug(err)
      this.setState({ isLoading: false })
      return false
    }
  }
}

const mapStateToProps = (state: any, props: any) => {
  const userInfo = getUserInfo(state)
  const lastUsedTeam = getLastUsedTeam(state)
  const checkInData = getCustomScreenParamData(props)
  return {
    checkInData,
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
    options: getCustomScreenParamOptions(props),
    isLoggedIn: isLoggedIn(state),
    formSailNumber: getFormFieldValue(competitorForm.COMPETITOR_FORM_NAME, sessionForm.FORM_KEY_SAIL_NUMBER)(state),
    regatta: getRegatta(checkInData.regattaName)(state),
  }
}

export default connect(mapStateToProps, { registerCompetitorAndDevice })(reduxForm<{}, Props>({
  form: competitorForm.COMPETITOR_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  validate: competitorForm.validate,
})(EditCompetitor))
