import React from 'react'
import { TextStyle, TouchableOpacity, ViewProps } from 'react-native'

import { OnPressType } from 'helpers/types'
import styles from './styles'

import ActivityIndicator from 'components/ActivityIndicator'
import Text from 'components/Text'


class TextButton extends React.Component<ViewProps & {
  textStyle?: TextStyle,
  isLoading?: boolean,
  disabled?: boolean,
  onPress?: OnPressType,
  loadingColor?: string,
} > {

  public renderSpinner() {
    const props = this.props.loadingColor && { color: this.props.loadingColor }
    return (
      <ActivityIndicator
        style={styles.spinnerStyle}
        size="small"
        {...props}
      />
    )
  }

  public renderText() {
    const {
      children,
      textStyle,
    } = this.props
    return (
      <Text style={textStyle}>
        {children}
      </Text>
    )
  }

  public render() {
    const {
      style,
      isLoading,
      disabled,
      onPress,
    } = this.props
    return (
      <TouchableOpacity
        style={[styles.containerStyle, style]}
        disabled={isLoading || disabled}
        onPress={onPress}
      >
        {isLoading ? this.renderSpinner() : this.renderText()}
      </TouchableOpacity>
    )
  }
}


export default TextButton
