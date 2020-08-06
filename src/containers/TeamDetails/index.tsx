import { compose, defaultTo, pick, prop } from 'ramda'
import React, { ChangeEvent } from 'react'
import { Alert, KeyboardType, NativeSyntheticEvent, ReturnKeyType, TextInputChangeEventData, View, ViewProps, ImageBackground } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import LinearGradient from 'react-native-linear-gradient'
import { isEmpty } from 'lodash'

import { updateCompetitor } from 'actions/sessions'
import { deleteTeam, DeleteTeamAction, saveTeam, SaveTeamAction, updateTeamImage, updateTeamImageAction } from 'actions/user'

import * as teamForm from 'forms/team'
import { ComparisonValidatorViewProps, validateNameExists, validateRequired, validateHandicap } from 'forms/validators'

import Logger from 'helpers/Logger'
import { getErrorDisplayMessage } from 'helpers/texts'

import { TeamTemplate } from 'models'
import { getDefaultHandicap, Handicap, hasHandicapChanged } from 'models/TeamTemplate'

import { getCustomScreenParamData } from 'navigation/utils'

import { getFormFieldValue } from 'selectors/form'
import { getUserTeamNames } from 'selectors/user'

import TextInputForm from 'components/base/TextInputForm'
import FormHandicapInput from 'components/form/FormHandicapInput'
import FormImagePicker from 'components/form/FormImagePicker'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import TextButton from 'components/TextButton'
import FormBoatClassInput from '../../components/form/FormBoatClassInput'
import FormNationalityPicker from '../../components/form/FormNationalityPicker'
import FormSailNumberInput from '../../components/form/FormSailNumberInput'

import I18n from 'i18n'

import Images from '@assets/Images'
import styles from './styles'
import { form,  button } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

interface Props extends ViewProps, NavigationScreenProps, ComparisonValidatorViewProps {
  team: TeamTemplate
  formTeamName?: string
  formSailNumber?: string
  formNationality?: string
  formBoatClass?: string
  formBoatName?: string
  formTeamImage?: any
  formHandicap?: Handicap
  paramTeamName?: string
  saveTeam: SaveTeamAction
  deleteTeam: DeleteTeamAction
  updateTeamImage: updateTeamImageAction
}

class TeamDetails extends TextInputForm<Props> {

  public state = {
    isLoading: false,
  }

  private commonProps = {
    keyboardType: 'default' as KeyboardType,
    returnKeyType: 'next' as ReturnKeyType,
    autoCorrect: false,
  }

  public componentDidMount() {
    this.props.navigation.setParams({
      onOptionsPressed: this.deleteTeam,
      paramTeamName: this.props.paramTeamName,
    })
  }

  public render() {
    const canSave = this.formIsSaveable() && this.formHasChanges()
    const isSaveDisabled = !canSave
    const isEditingExistingBoat = this.props.team !== undefined

    return (
      <ImageBackground source={Images.defaults.dots} style={{ width: '100%', height: '100%' }}>
        <ScrollContentView style={styles.container}>
          <LinearGradient colors={[$siTransparent, $siDarkBlue]} style={{ width: '100%', height: '100%' }} start={{ x: 0, y: 0 }} end={{ x: 0.0, y: 0.36 }}>
            <View style={styles.contentContainer}>
              <Field
                name={teamForm.FORM_KEY_IMAGE}
                component={FormImagePicker}
                placeholder={Images.header.team}
                onChange={this.onImageChange}/>
              <View style={form.formSegment1}>
                <Field
                  hint={I18n.t('text_hint_competitor_name')}
                  label={I18n.t('text_placeholder_competitor_name')}
                  name={teamForm.FORM_KEY_TEAM_NAME}
                  component={FormTextInput}
                  inputRef={this.handleInputRef(teamForm.FORM_KEY_TEAM_NAME)}
                  onSubmitEditing={this.handleOnSubmitInput(teamForm.FORM_KEY_BOAT_CLASS)}
                  {...this.commonProps}
                  validate={[validateRequired, validateNameExists]} />
                <Field
                  label={I18n.t('text_placeholder_boat_class')}
                  name={teamForm.FORM_KEY_BOAT_CLASS}
                  component={FormBoatClassInput}
                  inputRef={this.handleInputRef(teamForm.FORM_KEY_BOAT_CLASS)}
                  onSubmitEditing={this.handleOnSubmitInput(teamForm.FORM_KEY_NATIONALITY)}
                  validate={[validateRequired]}
                  editable={!isEditingExistingBoat}
                  {...this.commonProps} />
                <Field
                  label={I18n.t('text_nationality')}
                  name={teamForm.FORM_KEY_NATIONALITY}
                  component={FormNationalityPicker}
                  inputRef={this.handleInputRef(teamForm.FORM_KEY_NATIONALITY)}
                  onSubmitEditing={this.handleOnSubmitInput(teamForm.FORM_KEY_SAIL_NUMBER)}
                  onChange={this.handleNationalityChanged}
                  {...this.commonProps} />
                <Field
                  label={I18n.t('text_placeholder_sail_number')}
                  name={teamForm.FORM_KEY_SAIL_NUMBER}
                  component={FormSailNumberInput}
                  inputRef={this.handleInputRef(teamForm.FORM_KEY_SAIL_NUMBER)}
                  onSubmitEditing={this.handleOnSubmitInput(teamForm.FORM_KEY_BOAT_NAME)}
                  onSelectTeam={(team: any) => {
                    this.props.change(teamForm.FORM_KEY_BOAT_CLASS, team.boatClass || '')
                    this.props.change(teamForm.FORM_KEY_BOAT_NAME, team.boatName || '')
                    this.props.change(teamForm.FORM_KEY_NATIONALITY, team.nationality || '')
                  }}
                  validate={[validateRequired]}
                  editable={!isEditingExistingBoat}
                  {...this.commonProps} />
                <Field
                  label={I18n.t('text_placeholder_boat_name')}
                  name={teamForm.FORM_KEY_BOAT_NAME}
                  component={FormTextInput}
                  inputRef={this.handleInputRef(teamForm.FORM_KEY_BOAT_NAME)}
                  editable={!isEditingExistingBoat}
                  {...this.commonProps} />
              </View>
              <View style={form.formSegment2}>
                <Field
                  label={I18n.t('text_handicap_label')}
                  name={teamForm.FORM_KEY_HANDICAP}
                  component={FormHandicapInput}
                  validate={[validateHandicap]} />
              </View>
              <View style={form.lastFormSegment}>
                <TextButton
                  style={[button.primary, button.fullWidth, styles.saveButton]}
                  textStyle={button.primaryText}
                  onPress={this.props.handleSubmit(this.onSavePress)}
                  isLoading={this.state.isLoading}
                  disabled={isSaveDisabled}>
                    {I18n.t('caption_save').toUpperCase()}
                </TextButton>
              </View>
            </View>
          </LinearGradient>
        </ScrollContentView>
      </ImageBackground>
    )
  }

  protected onImageChange = (imageData: any) => {
    const { team } = this.props
    if (team) {
      this.props.updateTeamImage(team.name, imageData)
    }
  }

  protected handleNationalityChanged = (event?: ChangeEvent<any> | NativeSyntheticEvent<TextInputChangeEventData>,
                                        newValue?: any, previousValue?: any) => {
    if (!this.props.formSailNumber || this.props.formSailNumber === previousValue) {
      this.props.change(teamForm.FORM_KEY_SAIL_NUMBER, newValue)
    }
  }

  protected deleteTeam = () => {
    const { deleteTeam: deleteTeamAction, formTeamName } = this.props
    if (!formTeamName) {
      return
    }
    Alert.alert(
      I18n.t('caption_delete'),
      I18n.t('text_confirm_delete_team'),
      [
        { text: I18n.t('caption_cancel'), style: 'cancel' },
        {
          text: I18n.t('caption_ok'), onPress: async () => {
            deleteTeamAction(formTeamName)
            this.props.navigation.goBack()
          },
        },
      ],
      { cancelable: true },
    )
  }

  protected onSavePress = async (values: any) => {
    try {
      this.setState({ isLoading: true })
      const teamFromFormValues = teamForm.teamFromFormValues(values)
      if (!teamFromFormValues) {
        return false
      }

      const initialTeamPreservedValues = compose(
        pick(['id', 'competitorId', 'lastUsed']),
        defaultTo({}),
        prop('team')
      )(this.props)

      // Preserve some values from the initial team
      const team = {
        ...initialTeamPreservedValues,
        ...teamFromFormValues
      }

      await updateCompetitor(team)
      await this.props.saveTeam(team, { replaceTeamName: this.props.paramTeamName })
      this.props.navigation.goBack()
      return true
    } catch (err) {
      Logger.debug(err)
      Alert.alert(getErrorDisplayMessage(err))
      return false
    } finally {
      this.setState({ isLoading: false })
    }
  }

  private formIsSaveable() {
    const { formTeamName, formSailNumber, formNationality, formBoatClass } = this.props

    return !isEmpty(formTeamName) && !isEmpty(formSailNumber) && !isEmpty(formBoatClass)
  }

  private formHasChanges() {
    const {
      team,
      formTeamName,
      formSailNumber,
      formNationality,
      formBoatClass,
      formBoatName,
      formHandicap,
    } = this.props

    const nameHasChanged = !team || formTeamName !== team.name
    const sailNumberHasChanged = !team || formSailNumber !== team.sailNumber
    const nationalityHasChanged = !team || formNationality !== team.nationality
    const boatClassHasChanged = !team || formBoatClass !== team.boatClass
    const boatNameHasChanged = !team || formBoatName !== team.boatName

    const handicapHasChanged = !team || hasHandicapChanged(team.handicap, formHandicap)

    return (
      nameHasChanged ||
      sailNumberHasChanged ||
      nationalityHasChanged ||
      boatClassHasChanged ||
      boatNameHasChanged ||
      handicapHasChanged
    )
  }
}

const mapStateToProps = (state: any, props: any) => {
  const team: TeamTemplate | undefined = getCustomScreenParamData(props)
  const formTeamName = getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_TEAM_NAME)(state)
  const formSailNumber = getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_SAIL_NUMBER)(state)
  const formNationality = getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_NATIONALITY)(state)
  const formBoatClass = getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_BOAT_CLASS)(state)
  const formBoatName = getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_BOAT_NAME)(state)
  const formTeamImage = getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_IMAGE)(state)
  const formHandicap = getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_HANDICAP)(state)
  const paramTeamName = team && team.name
  return {
    team,
    formTeamName,
    formSailNumber,
    formNationality,
    formBoatClass,
    formBoatName,
    formTeamImage,
    formHandicap,
    paramTeamName,
    comparisonValue: getUserTeamNames(state),
    ignoredValue: paramTeamName,
    initialValues: team ? {
      [teamForm.FORM_KEY_TEAM_NAME]: team.name,
      [teamForm.FORM_KEY_NATIONALITY]: team.nationality,
      [teamForm.FORM_KEY_BOAT_NAME]: team.boatName,
      [teamForm.FORM_KEY_SAIL_NUMBER]: team.sailNumber,
      [teamForm.FORM_KEY_BOAT_CLASS]: team.boatClass,
      [teamForm.FORM_KEY_IMAGE]: team.imageData,
      [teamForm.FORM_KEY_HANDICAP]: team.handicap || getDefaultHandicap(),
    } : {
      [teamForm.FORM_KEY_HANDICAP]: getDefaultHandicap(),
    },
  } as ComparisonValidatorViewProps
}

export default connect(
  mapStateToProps,
  { saveTeam, deleteTeam, updateTeamImage },
)(
  reduxForm<{}, Props>({
    form: teamForm.TEAM_FORM_NAME,
    destroyOnUnmount: false,
    enableReinitialize: true,
    forceUnregisterOnUnmount: true,
  })(TeamDetails),
)
