import React, { Component } from 'react'
import { Switch, ViewProps  } from 'react-native'

import EditItem from 'components/EditItem'

import { $primaryButtonColor, $secondaryBackgroundColor } from 'styles/colors'


class EditItemSwitch extends React.Component<ViewProps & {
  title: string,
  switchValue: boolean,
  onEdit?: () => void,
  renderEditControl?: () => Component | Element | JSX.Element,
  onSwitchValueChange?: (value: any) => void,
  isLoading?: boolean,
} > {

  public state = { tempValue: this.props.switchValue }

  public  valueChanged = async (value: any) => {
    const { onSwitchValueChange } = this.props
    await this.setState({ tempValue: value })
    if (onSwitchValueChange) {
      onSwitchValueChange(value)
    }
  }

  public renderSwitch = () => {
    const { switchValue, isLoading } = this.props
    return (
      <Switch
        trackColor={{ true: $primaryButtonColor, false: $secondaryBackgroundColor }}
        tintColor={$primaryButtonColor}
        onValueChange={this.valueChanged}
        value={isLoading ? this.state.tempValue : switchValue}
      />
    )
  }

  public render() {
    const {
      children,
      style,
      title,
      ...remainingProps
    } = this.props
    return (
      <EditItem
        style={style}
        title={title}
        renderEditControl={this.renderSwitch}
        {...remainingProps}
      >
        {children}
      </EditItem>
    )
  }
}

export default EditItemSwitch
