import { findIndex } from 'lodash'
import React from 'react'
import { Text, View, ViewProps } from 'react-native'
import SwitchSelector from 'react-native-switch-selector'
import { WrappedFieldProps } from 'redux-form'

import FormTextInput from 'components/form/FormTextInput'
import { HandicapTypes } from 'models/TeamTemplate'

import styles from './styles'

const handicapTypeSelectorOptions = [
  { label: 'Yardstick', value: HandicapTypes.Yardstick },
  { label: 'ToT', value: HandicapTypes.TimeOnTime },
]

class FormHandicapInput extends React.Component<
  ViewProps & WrappedFieldProps & {
    label: string,
  }
> {
  public render() {
    const { style, label } = this.props
    const {
      value: handicapType,
      onChange: handicapTypeOnChange,
    } = this.getHandicapTypeProps()

    return (
      <View style={style}>
        <Text style={styles.label}>
          {label.toUpperCase()}
        </Text>
        <SwitchSelector
          options={handicapTypeSelectorOptions}
          initial={this.getHandicapTypeOptionIndex(handicapType)}
          value={this.getHandicapTypeOptionIndex(handicapType)}
          onPress={handicapTypeOnChange}
          backgroundColor="#EEEEEE"
          selectedColor="#028DD4"
          buttonColor="#FFFFFF"
          textColor="#909090"
          borderColor="#EEEEEE"
          borderRadius={3}
          hasPadding={
            /* This is for the padding between the button color and border */
            true
          }
          style={styles.switchSelector}
        />
        <FormTextInput
          {...this.getHandicapValueProps()}
        />
      </View>
    )
  }

  private getHandicapTypeOptionIndex = (value: string) => {
    const index = findIndex(handicapTypeSelectorOptions, ['value', value])
    return index === -1 ? 0 : index
  }

  private getHandicapTypeProps = () => {
    const {
      input: { value: inputValue , onChange },
    } = this.props

    const handicapTypeOnChange = (value: any) => onChange({
      handicapType: value,
      handicapValue: inputValue.handicapValue,
    })

    return {
      value: inputValue.handicapType,
      onChange: handicapTypeOnChange,
    }
  }

  private getHandicapValueProps = () => {
    const {
      input: { value: inputValue , onChange, ...restInputProps },
    } = this.props

    const handicapValue = inputValue.handicapValue
    const handicapValueOnChange = (value: any) => onChange({
      handicapType: inputValue.handicapType,
      handicapValue: value,
    })

    return {
      ...this.props,
      input: {
        value: handicapValue,
        onChange: handicapValueOnChange,
        ...restInputProps,
      },
    }
  }
}

export default FormHandicapInput
