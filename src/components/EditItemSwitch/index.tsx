import React, { Component } from 'react'
import { Platform, StyleProp, Switch, TextStyle, ViewProps  } from 'react-native'

import EditItem from 'components/EditItem'

import { $secondaryBackgroundColor } from 'styles/colors'


class EditItemSwitch extends React.Component<ViewProps & {
  title: string,
  titleStyle: StyleProp<TextStyle>
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
    const switchProps = Platform.OS !== 'android' ? {
      trackColor: { true: '#476987', false: $secondaryBackgroundColor },
      tintColor: '#476987',
    } : {}
    return (
      <Switch
        {...switchProps}
        onValueChange={this.valueChanged}
        value={isLoading ? this.state.tempValue : switchValue}
      />
    )
  }

  public render() {
    const {
      children,
      style,
      titleStyle,
      title,
      ...remainingProps
    } = this.props
    return (
      <EditItem
        style={style}
        titleStyle={titleStyle}
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
