import React from 'react'
import { TouchableOpacity, ViewProps, ViewStyle } from 'react-native'

import { OnPressType } from 'helpers/types'
import styles from './styles'

import ActivityIndicator from 'components/ActivityIndicator'


abstract class BaseButton<P = {}, S = {}, SS = any> extends React.Component<P & ViewProps & {
  isLoading?: boolean,
  disabled?: boolean,
  onPress?: OnPressType,
  loadingColor?: string,
}, S, SS> {

  protected abstract renderContent: () => Element | JSX.Element

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
    } = this.props

    const touchableStyle = this.getTouchableStyle()

    return (
      <TouchableOpacity
        onLayout={this.handleContentSizeChanged}
        style={!touchableStyle || isLoading ? [styles.containerStyle, style] : touchableStyle}
        disabled={isLoading || disabled}
        onPress={onPress}
      >
        {isLoading ? this.renderSpinner() : this.renderContent()}
      </TouchableOpacity>
    )
  }

  protected handleContentSizeChanged: (event: any) => void = (event: any) => {
    return
  }

  protected getTouchableStyle: () => ViewStyle | ViewStyle[] | undefined = () => {
    return undefined
  }
}


export default BaseButton
