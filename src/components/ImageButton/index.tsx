import React from 'react'
import { Image, ImageProps, ImageStyle,  TouchableOpacity } from 'react-native'

import { OnPressType } from 'helpers/types'
import { $defaultImageButtonSize } from 'styles/dimensions'
import styles from './styles'


class ImageButton extends React.Component<ImageProps & {
  imageStyle?: ImageStyle,
  onPress?: OnPressType,
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
      activeOpacity,
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
        activeOpacity={activeOpacity}
      >
        <Image
          source={source}
          style={[styles.imageStyle, imageStyle]}
          {...remainingProps}
        />
      </TouchableOpacity>
    )
  }
}


export default ImageButton
