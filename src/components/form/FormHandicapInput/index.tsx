import { findIndex } from 'lodash'
import React from 'react'
import { Text, View, ViewProps } from 'react-native'
import SwitchSelector from 'react-native-switch-selector'
import { WrappedFieldsProps } from 'redux-form'

import * as teamForm from 'forms/team'
import FormTextInput from 'components/form/FormTextInput'
import { HandicapTypes } from 'models/TeamTemplate'

const handicapTypeSelectorOptions = [
  { label: HandicapTypes.Yardstick, value: HandicapTypes.Yardstick },
  { label: HandicapTypes.TimeOnTime, value: HandicapTypes.TimeOnTime },
]

class FormHandicapInput extends React.Component<
  ViewProps & WrappedFieldsProps & {
    label: string,
  }
> {
  public render() {
    const { style, label } = this.props
    const {
      input: { value: handicapType, onChange: handicapTypeOnChange },
    } = this.props[teamForm.FORM_KEY_HANDICAP_TYPE]
    const handicapValueProps = this.props[teamForm.FORM_KEY_HANDICAP_VALUE]

    return (
      <View style={style}>
        <Text>
          {label}
        </Text>
        <SwitchSelector
          options={handicapTypeSelectorOptions}
          initial={this.getHandicapTypeOptionIndex(handicapType)}
          onPress={handicapTypeOnChange}
        />
        <FormTextInput
          {...handicapValueProps}
        />
      </View>
    )
  }

  private getHandicapTypeOptionIndex = (value: string) => {
    const index = findIndex(handicapTypeSelectorOptions, ['value', value])
    return index === -1 ? 0 : index
  }
}

export default FormHandicapInput
