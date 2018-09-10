import React from 'react'
import { TouchableOpacity } from 'react-native'

import ActivityIndicator from 'components/ActivityIndicator'
import Text from 'components/Text'

import { StyleSheetType } from 'helpers/types'
import styles from './styles'


class TextButton extends React.Component<{
  style?: any,
  children?: any,
  textStyle?: StyleSheetType,
  isLoading?: boolean,
  disabled?: boolean,
  onPress?: () => void,
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
