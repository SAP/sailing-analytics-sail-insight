import { isEmpty } from 'lodash'
import React, { ChangeEvent } from 'react'
import {
  Alert, KeyboardType, NativeSyntheticEvent, ReturnKeyType, TextInputChangeEventData, View, ViewProps,
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import Images from '@assets/Images'
import {
  deleteTeam,
  DeleteTeamAction,
  saveTeam,
  SaveTeamAction,
  updateTeamImage,
  updateTeamImageAction,
} from 'actions/user'
import * as teamForm from 'forms/team'
import { ComparisonValidatorViewProps, validateNameExists, validateRequired } from 'forms/validators'
import Logger from 'helpers/Logger'
import { getErrorDisplayMessage } from 'helpers/texts'
import I18n from 'i18n'
import { TeamTemplate } from 'models'
import { getDefaultHandicap, Handicap, hasHandicapChanged } from 'models/TeamTemplate'
import { navigateBack } from 'navigation'
import { getCustomScreenParamData } from 'navigation/utils'
import { getFormFieldValue } from 'selectors/form'
import { getUserTeamNames } from 'selectors/user'

import TextInputForm from 'components/base/TextInputForm'
import FormHandicapInput from 'components/form/FormHandicapInput'
import FormImagePicker from 'components/form/FormImagePicker'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import TextButton from 'components/TextButton'

import { button, container } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import FormBoatClassInput from '../../components/form/FormBoatClassInput'
import FormNationalityPicker from '../../components/form/FormNationalityPicker'
import FormSailNumberInput from '../../components/form/FormSailNumberInput'

import styles from './styles'

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

    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={container.stretchContent}>
          <Field
            name={teamForm.FORM_KEY_IMAGE}
            component={FormImagePicker}
            placeholder={Images.header.team}
            onChange={this.onImageChange}
          />
        </View>
        <View style={[styles.bottomContainer]}>
          <Field
            style={styles.topInput}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            label={I18n.t('text_placeholder_team_name')}
            name={teamForm.FORM_KEY_TEAM_NAME}
            component={FormTextInput}
            inputRef={this.handleInputRef(teamForm.FORM_KEY_TEAM_NAME)}
            onSubmitEditing={this.handleOnSubmitInput(teamForm.FORM_KEY_BOAT_CLASS)}
            {...this.commonProps}
            validate={[validateRequired, validateNameExists]}
          />
          <Field
            style={styles.topInput}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            label={I18n.t('text_placeholder_boat_class')}
            name={teamForm.FORM_KEY_BOAT_CLASS}
            component={FormBoatClassInput}
            inputRef={this.handleInputRef(teamForm.FORM_KEY_BOAT_CLASS)}
            onSubmitEditing={this.handleOnSubmitInput(teamForm.FORM_KEY_NATIONALITY)}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            style={styles.topInput}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            label={I18n.t('text_nationality')}
            name={teamForm.FORM_KEY_NATIONALITY}
            component={FormNationalityPicker}
            inputRef={this.handleInputRef(teamForm.FORM_KEY_NATIONALITY)}
            onSubmitEditing={this.handleOnSubmitInput(teamForm.FORM_KEY_SAIL_NUMBER)}
            onChange={this.handleNationalityChanged}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            style={styles.topInput}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
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
            {...this.commonProps}
          />
          <Field
            style={styles.topInput}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            label={I18n.t('text_placeholder_boat_name')}
            name={teamForm.FORM_KEY_BOAT_NAME}
            component={FormTextInput}
            inputRef={this.handleInputRef(teamForm.FORM_KEY_BOAT_NAME)}
            {...this.commonProps}
          />
          <Field
            style={styles.topInput}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            label={I18n.t('text_handicap_label')}
            name={teamForm.FORM_KEY_HANDICAP}
            component={FormHandicapInput}
          />
          <TextButton
            style={[registration.nextButton(), styles.bottomButton]}
            textStyle={button.actionText}
            onPress={this.props.handleSubmit(this.onSavePress)}
            isLoading={this.state.isLoading}
            disabled={isSaveDisabled}
          >
            {I18n.t('caption_save').toUpperCase()}
          </TextButton>
        </View>
      </ScrollContentView>
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
            navigateBack()
          },
        },
      ],
      { cancelable: true },
    )
  }

  protected onSavePress = async (values: any) => {
    try {
      this.setState({ isLoading: true })
      const team = teamForm.teamFromFormValues(values)
      if (!team) {
        return false
      }
      await this.props.saveTeam(team, { replaceTeamName: this.props.paramTeamName })
      navigateBack()
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

    return !isEmpty(formTeamName) && !isEmpty(formSailNumber) && !isEmpty(formNationality) && !isEmpty(formBoatClass)
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
