import React from 'react'
import {
  Alert, KeyboardType, ReturnKeyType, View, ViewProps,
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import Images from '@assets/Images'
import { deleteBoat, DeleteBoatAction, saveBoat, SaveBoatAction } from 'actions/user'
import * as boatForm from 'forms/boat'
import { ComparisonValidatorViewProps, validateNameExists, validateRequired } from 'forms/validators'
import Logger from 'helpers/Logger'
import { getErrorDisplayMessage } from 'helpers/texts'
import I18n from 'i18n'
import { TeamTemplate } from 'models'
import { navigateBack } from 'navigation'
import { getCustomScreenParamData } from 'navigation/utils'
import { getFormFieldValue } from 'selectors/form'
import { getUserBoatNames } from 'selectors/user'

import TextInputForm from 'components/base/TextInputForm'
import FormImagePicker from 'components/form/FormImagePicker'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import TextButton from 'components/TextButton'

import { button, container, input } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import FormBoatClassInput from '../../components/form/FormBoatClassInput'


interface Props extends ViewProps, NavigationScreenProps, ComparisonValidatorViewProps {
  formBoatName?: string
  paramBoatName?: string
  saveBoat: SaveBoatAction
  deleteBoat: DeleteBoatAction
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
      onOptionsPressed: this.deleteBoat,
      paramBoatName: this.props.paramBoatName,
    })
  }

  public render() {
    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={container.stretchContent}>
          <Field
            name={boatForm.FORM_KEY_IMAGE}
            component={FormImagePicker}
            placeholder={Images.header.boat}
            disabled={true}
          />
        </View>
        <View style={registration.bottomContainer()}>
          <Field
            label={I18n.t('text_placeholder_boat_name')}
            name={boatForm.FORM_KEY_NAME}
            component={FormTextInput}
            inputRef={this.handleInputRef(boatForm.FORM_KEY_NAME)}
            onSubmitEditing={this.handleOnSubmitInput(boatForm.FORM_KEY_SAIL_NUMBER)}
            {...this.commonProps}
            validate={[validateRequired, validateNameExists]}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_sail_number')}
            name={boatForm.FORM_KEY_SAIL_NUMBER}
            component={FormTextInput}
            inputRef={this.handleInputRef(boatForm.FORM_KEY_SAIL_NUMBER)}
            onSubmitEditing={this.handleOnSubmitInput(boatForm.FORM_KEY_BOAT_CLASS)}
            validate={[validateRequired]}
            {...this.commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_boat_class')}
            name={boatForm.FORM_KEY_BOAT_CLASS}
            component={FormBoatClassInput}
            inputRef={this.handleInputRef(boatForm.FORM_KEY_BOAT_CLASS)}
            {...this.commonProps}
          />
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.props.handleSubmit(this.onSavePress)}
            isLoading={this.state.isLoading}
          >
            {I18n.t('caption_save')}
          </TextButton>
        </View>
      </ScrollContentView>
    )
  }

  protected deleteBoat = () => {
    const { deleteBoat: deleteBoatAction, formBoatName } = this.props
    if (!formBoatName) {
      return
    }
    Alert.alert(
      I18n.t('caption_delete'),
      I18n.t('text_confirm_delete_boat'),
      [
        { text: I18n.t('caption_cancel'), style: 'cancel' },
        {
          text: I18n.t('caption_ok'), onPress: async () => {
            deleteBoatAction(formBoatName)
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
      const boat = boatForm.boatFromFormValues(values)
      if (!boat) {
        return false
      }
      await this.props.saveBoat(boat, { replaceBoatName: this.props.paramBoatName })
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
}

const mapStateToProps = (state: any, props: any) => {
  const boat: TeamTemplate | undefined = getCustomScreenParamData(props)
  const formBoatName = getFormFieldValue(boatForm.BOAT_FORM_NAME, boatForm.FORM_KEY_NAME)(state)
  const paramBoatName = boat && boat.name
  return {
    formBoatName,
    paramBoatName,
    comparisonValue: getUserBoatNames(state),
    ignoredValue: paramBoatName,
    initialValues: boat && {
      [boatForm.FORM_KEY_NAME]: boat.name,
      [boatForm.FORM_KEY_SAIL_NUMBER]: boat.sailNumber,
      [boatForm.FORM_KEY_BOAT_CLASS]: boat.boatClass,
    },
  } as ComparisonValidatorViewProps
}

export default connect(mapStateToProps, { saveBoat, deleteBoat })(reduxForm<{}, Props>({
  form: boatForm.BOAT_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})(TeamDetails))
