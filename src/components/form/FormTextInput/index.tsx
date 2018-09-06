import React from 'react'

import { StyleSheetType } from 'helpers/types'
import { container } from 'styles/commons'

import TextInput from 'components/TextInput'


class FormTextInput extends React.Component<{
  firstLine?: string,
  secondLine?: string,
  style?: StyleSheetType,
  label?: string,
  input?: any,
  meta?: any,
} > {
  public render() {
    const {
      label,
      input: { name, onChange, ...restInput },
      meta: { touched: showError, error },
      style,
      ...additionalProps
    } = this.props

    return (
      <TextInput
        style={style}
        placeholder={label}
        error={showError ? error : undefined}
        onChangeText={onChange}
        {...restInput}
        {...additionalProps}
      />
    )
  }
}


export default FormTextInput
