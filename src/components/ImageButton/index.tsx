import React from 'react'
import { Image, TouchableOpacity } from 'react-native'

import { $defaultImageButtonSize } from 'styles/dimensions'

import { ImageSource, StyleSheetType } from 'helpers/types'
import styles from './styles'


class ImageButton extends React.Component<{
  style?: StyleSheetType,
  imageStyle?: StyleSheetType,
  source?: ImageSource,
  onPress?: () => void,
  circular?: boolean,
  autoWidth?: boolean,
  activeOpacity?: number,
} > {
  public state = {
    borderRadius: $defaultImageButtonSize / 2,
    width: $defaultImageButtonSize,
  }

  public handleContentSizeChange = (event: any) => {
    const height = event && event.nativeEvent && event.nativeEvent.layout && event.nativeEvent.layout.height
    if (!height) {
      return
    }
    this.setState({
      borderRadius: height / 2,
      width: height,
    })
  }

  public render() {
    const {
      circular,
      autoWidth,
      style,
      imageStyle,
      source,
      onPress,
      ...remainingProps
    } = this.props

    const touchableStyle = [
      styles.containerStyle,
      circular && { borderRadius: this.state.borderRadius },
      autoWidth && { width: this.state.width },
      style,
    ]

    return (
      <TouchableOpacity
        onLayout={this.handleContentSizeChange}
        style={touchableStyle}
        onPress={onPress}
        {...remainingProps}
      >
        <Image
          source={source}
          style={[styles.imageStyle, imageStyle]}
        />
      </TouchableOpacity>
    )
  }
}


export default ImageButton
