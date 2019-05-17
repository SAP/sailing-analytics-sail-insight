import { isEmpty } from 'lodash'
import React from 'react'
import {
  Alert, KeyboardType, ReturnKeyType, View, ViewProps,
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import Images from '@assets/Images'
import { deleteTeam, DeleteTeamAction, saveTeam, SaveTeamAction } from 'actions/user'
import * as teamForm from 'forms/team'
import { ComparisonValidatorViewProps, validateNameExists, validateRequired } from 'forms/validators'
import Logger from 'helpers/Logger'
import { getErrorDisplayMessage } from 'helpers/texts'
import I18n from 'i18n'
import { TeamTemplate } from 'models'
import { navigateBack } from 'navigation'
import { getCustomScreenParamData } from 'navigation/utils'
import { getFormFieldValue } from 'selectors/form'
import { getUserTeamNames } from 'selectors/user'

import TextInputForm from 'components/base/TextInputForm'
import FormImagePicker from 'components/form/FormImagePicker'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import TextButton from 'components/TextButton'

import { button, container, input } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import FormBoatClassInput from '../../components/form/FormBoatClassInput'
import FormNationalityPicker from '../../components/form/FormNationalityPicker'


interface Props extends ViewProps, NavigationScreenProps, ComparisonValidatorViewProps {
  team: TeamTemplate
  formTeamName?: string
  formSailNumber?: string
  formNationality?: string
  formBoatClass?: string
  formBoatName?: string
  paramTeamName?: string
  saveTeam: SaveTeamAction
  deleteTeam: DeleteTeamAction
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
            disabled={true}
          />
        </View>
        <View style={registration.bottomContainer()}>
          <Field
            label={I18n.t('text_placeholder_team_name')}
            name={teamForm.FORM_KEY_TEAM_NAME}
            component={FormTextInput}
            inputRef={this.handleInputRef(teamForm.FORM_KEY_TEAM_NAME)}
            onSubmitEditing={this.handleOnSubmitInput(teamForm.FORM_KEY_SAIL_NUMBER)}
            {...this.commonProps}
            validate={[validateRequired, validateNameExists]}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_sail_number')}
            name={teamForm.FORM_KEY_SAIL_NUMBER}
            component={FormTextInput}
            inputRef={this.handleInputRef(teamForm.FORM_KEY_SAIL_NUMBER)}
            onSubmitEditing={this.handleOnSubmitInput(teamForm.FORM_KEY_NATIONALITY)}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_nationality')}
            name={teamForm.FORM_KEY_NATIONALITY}
            component={FormNationalityPicker}
            inputRef={this.handleInputRef(teamForm.FORM_KEY_NATIONALITY)}
            onSubmitEditing={this.handleOnSubmitInput(teamForm.FORM_KEY_SAIL_NUMBER)}
            {...this.commonProps}
            validate={[validateRequired]}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_boat_class')}
            name={teamForm.FORM_KEY_BOAT_CLASS}
            component={FormBoatClassInput}
            inputRef={this.handleInputRef(teamForm.FORM_KEY_BOAT_CLASS)}
            onSubmitEditing={this.handleOnSubmitInput(teamForm.FORM_KEY_BOAT_NAME)}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_boat_name')}
            name={teamForm.FORM_KEY_BOAT_NAME}
            component={FormTextInput}
            inputRef={this.handleInputRef(teamForm.FORM_KEY_BOAT_NAME)}
            {...this.commonProps}
          />
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.props.handleSubmit(this.onSavePress)}
            isLoading={this.state.isLoading}
            disabled={isSaveDisabled}
          >
            {I18n.t('caption_save')}
          </TextButton>
        </View>
      </ScrollContentView>
    )
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
    const { team, formTeamName, formSailNumber, formNationality, formBoatClass, formBoatName } = this.props

    const nameHasChanged = !team || formTeamName !== team.name
    const sailNumberHasChanged = !team || formSailNumber !== team.sailNumber
    const nationalityHasChanged = !team || formNationality !== team.nationality
    const boatClassHasChanged = !team || formBoatClass !== team.boatClass
    const boatNameHasChanged = !team || formBoatName !== team.boatName

    return nameHasChanged || sailNumberHasChanged || nationalityHasChanged || boatClassHasChanged || boatNameHasChanged
  }
}

const mapStateToProps = (state: any, props: any) => {
  const team: TeamTemplate | undefined = getCustomScreenParamData(props)
  const formTeamName = getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_TEAM_NAME)(state)
  const formSailNumber = getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_SAIL_NUMBER)(state)
  const formNationality = getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_NATIONALITY)(state)
  const formBoatClass = getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_BOAT_CLASS)(state)
  const formBoatName = getFormFieldValue(teamForm.TEAM_FORM_NAME, teamForm.FORM_KEY_BOAT_NAME)(state)
  const paramTeamName = team && team.name
  return {
    team,
    formTeamName,
    formSailNumber,
    formNationality,
    formBoatClass,
    formBoatName,
    paramTeamName,
    comparisonValue: getUserTeamNames(state),
    ignoredValue: paramTeamName,
    initialValues: team && {
      [teamForm.FORM_KEY_TEAM_NAME]: team.name,
      [teamForm.FORM_KEY_NATIONALITY]: team.nationality,
      [teamForm.FORM_KEY_BOAT_NAME]: team.boatName,
      [teamForm.FORM_KEY_SAIL_NUMBER]: team.sailNumber,
      [teamForm.FORM_KEY_BOAT_CLASS]: team.boatClass,
    },
  } as ComparisonValidatorViewProps
}

export default connect(mapStateToProps, { saveTeam, deleteTeam })(reduxForm<{}, Props>({
  form: teamForm.TEAM_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})(TeamDetails))
