import React from 'react'
import { View } from 'react-native'
import { WrappedFieldProps } from 'redux-form'

import EditItemSwitch from 'components/EditItemSwitch'

class FormCheckbox extends React.Component<WrappedFieldProps &  {
  label: string,
  style?: any,
  checkBoxStyle?: any,
} > {
  public render() {
    const {
      label,
      input: { value, onChange },
      style,
      checkBoxStyle,
      ...additionalProps
    } = this.props

    return (
      <View style={style}>
        <EditItemSwitch
          style={checkBoxStyle}
          title={label}
          switchValue={value}
          onSwitchValueChange={onChange}
          {...additionalProps}
        />
      </View>
    )
  }
}


export default FormCheckbox
