import { get } from 'lodash'
import React from 'react'
import {
  View, ViewProps,
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import Images from '@assets/Images'
import * as boatForm from 'forms/boat'
import { validateRequired } from 'forms/validators'
import I18n from 'i18n'
import { Boat } from 'models'
import { getValues } from 'selectors/form'

import TextInputForm from 'components/base/TextInputForm'
import FormImagePicker from 'components/form/FormImagePicker'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import TextButton from 'components/TextButton'

import { button, container, input } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'


class BoatDetails extends TextInputForm<ViewProps & NavigationScreenProps & {
  boatName: string,
}> {

  public render() {
    const commonProps = this.getCommonFieldProps()

    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={container.stretchContent}>
          <Field
            name={boatForm.FORM_KEY_IMAGE}
            component={FormImagePicker}
            placeholder={Images.header.boat}
          />
        </View>
        <View style={registration.bottomContainer()}>
          <Field
            label={I18n.t('text_placeholder_boat_name')}
            name={boatForm.FORM_KEY_NAME}
            component={this.renderField}
            inputRef={this.handleInputRef(boatForm.FORM_KEY_NAME)}
            onSubmitEditing={this.handleOnSubmit(boatForm.FORM_KEY_SAIL_NUMBER)}
            {...commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_sail_number')}
            name={boatForm.FORM_KEY_SAIL_NUMBER}
            component={this.renderField}
            inputRef={this.handleInputRef(boatForm.FORM_KEY_SAIL_NUMBER)}
            onSubmitEditing={this.handleOnSubmit(boatForm.FORM_KEY_BOAT_CLASS)}
            {...commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_boat_class')}
            name={boatForm.FORM_KEY_BOAT_CLASS}
            component={this.renderField}
            inputRef={this.handleInputRef(boatForm.FORM_KEY_BOAT_CLASS)}
            onSubmitEditing={this.handleOnSubmit(boatForm.FORM_KEY_SAIL_COLOR)}
            {...commonProps}
          />
          <Field
            style={input.topMargin}
            label={I18n.t('text_placeholder_sail_color')}
            name={boatForm.FORM_KEY_SAIL_COLOR}
            component={this.renderField}
            inputRef={this.handleInputRef(boatForm.FORM_KEY_SAIL_COLOR)}
            {...commonProps}
          />
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
          >
            {I18n.t('caption_accept')}
          </TextButton>
        </View>
      </ScrollContentView>
    )
  }

  protected getCommonFieldProps = () => ({
    validate: [validateRequired],
    keyboardType: 'default',
    returnKeyType: 'next',
  })

  protected renderField(props: any) {
    return <FormTextInput {...props}/>
  }

  protected updateScreenTitle = (title: string) => {
    this.props.navigation.setParams({ heading: title })
  }
}

const mapStateToProps = (state: any, props: any) => {
  const boat = props.navigation.state.params as Boat
  return {
    initialValues: {
      [boatForm.FORM_KEY_NAME]: boat.name,
      [boatForm.FORM_KEY_SAIL_NUMBER]: boat.sailNumber,
      [boatForm.FORM_KEY_SAIL_COLOR]: boat.sailColor,
      [boatForm.FORM_KEY_BOAT_CLASS]: boat.boatClass,
    },
    boatName: get(getValues(boatForm.FORM_KEY_SAIL_NUMBER)(state), boatForm.BOAT_FORM_NAME),
  }
}

export default connect(mapStateToProps)(reduxForm({
  form: boatForm.BOAT_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})((props: any) => <BoatDetails {...props}/>))
