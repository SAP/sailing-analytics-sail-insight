import React from 'react'
import { TextInputProps as RNTextInputProps, ViewProps } from 'react-native'

import TextInput, { TextInputProps } from 'components/TextInput'
import { WrappedFieldProps } from 'redux-form'


class FormTextInput extends React.Component<ViewProps & RNTextInputProps & WrappedFieldProps & TextInputProps & {
  label?: string,
  input?: any,
  meta?: any,
} > {
  public state = {
    text: this.props.value || '',
    previousPropsText: undefined
  }

  static getDerivedStateFromProps(nextProps: any, previousState: any) {
    if (nextProps.value !== previousState.previousPropsText) {
      return { 
        text: nextProps.value,
        previousPropsText: nextProps.value
      }
    }
    return null
  }

  public render() {
    const {
      label,
      input: { name, onChange, ...restInput },
      meta: { touched: showError, error },
      style,
      ...additionalProps
    } = this.props

    const { text: stateText } = this.state

    return (
      <TextInput
        style={style}
        placeholder={label}
        error={showError ? error : undefined}
        onChangeText={onChange}
        {...restInput}
        {...additionalProps}
        value={stateText}
      />
    )
  }
}


export default FormTextInput
