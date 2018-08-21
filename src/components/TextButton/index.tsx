import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import Spinner from 'components/ActivityIndicator'

import styles from './styles'


class TextButton extends React.Component<{
  style?: any,
  children?: any,
  textStyle?: any,
  isLoading?: boolean,
  disabled?: boolean,
  onPress?: () => void,
} > {

  public renderSpinner() {
    return <Spinner style={styles.spinnerStyle} size="small" />
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
