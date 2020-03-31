import React from 'react'
import { TextStyle, TouchableOpacity, ViewProps, ViewStyle } from 'react-native'

import { OnPressType } from 'helpers/types'

import ActivityIndicator from 'components/ActivityIndicator'

import styles from './styles'


abstract class BaseButton<P = {}, S = {}, SS = any> extends React.Component<P & ViewProps & {
  isLoading?: boolean,
  disabled?: boolean,
  onPress?: OnPressType,
  loadingColor?: string,
  disabledStyle?: TextStyle | ViewStyle,
  preserveShapeWhenLoading?: boolean
}, S, SS> {

  protected abstract renderContent: () => Element | JSX.Element

  protected state = {
    width: undefined,
    height: undefined
  }

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

  public render() {
    const {
      style,
      isLoading,
      disabled,
      onPress,
      disabledStyle,
      preserveShapeWhenLoading = false
    } = this.props

    const { width, height } = this.state

    const dimensionOverride =
      preserveShapeWhenLoading && isLoading && width && height
        ? { width, height }
        : {}

    const touchableStyle = this.getTouchableStyle()
    const additionalStyle = disabled ? [styles.disabled, disabledStyle] : undefined
    return (
      <TouchableOpacity
        onLayout={this.handleContentSizeChanged}
        style={[
          !touchableStyle || isLoading
            ? [styles.containerStyle, style]
            : [touchableStyle],
          additionalStyle,
          dimensionOverride
        ]}
        disabled={isLoading || disabled}
        onPress={onPress}
      >
        {isLoading ? this.renderSpinner() : this.renderContent()}
      </TouchableOpacity>
    )
  }

  protected handleContentSizeChanged: (event: any) => void = (event: any) => {
    const { width, height } = event?.nativeEvent?.layout
    if (width && height && !this.props.isLoading) {
      this.setState({ width, height })
    }
    return
  }

  protected getTouchableStyle: () => ViewStyle | ViewStyle[] | undefined = () => {
    return undefined
  }
}


export default BaseButton
