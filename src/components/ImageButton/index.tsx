import React from 'react'
import { Image, ImageProps, ImageStyle } from 'react-native'

import { $defaultImageButtonSize } from 'styles/dimensions'
import styles from './styles'

import BaseButton from 'components/base/BaseButton'


class ImageButton<P = {}> extends BaseButton<P & ImageProps & {
  imageStyle?: ImageStyle,
  circular?: boolean,
  autoWidth?: boolean,
  activeOpacity?: number,
} > {

  public static defaultProps = {
    loadingColor: 'black',
  }
  public state = {
    borderRadius: $defaultImageButtonSize / 2,
    width: $defaultImageButtonSize,

  }

  protected handleContentSizeChanged = (event: any) => {
    const height = event && event.nativeEvent && event.nativeEvent.layout && event.nativeEvent.layout.height
    if (!height) {
      return
    }
    this.setState({
      borderRadius: height / 2,
      width: height,
    })
  }

  protected getTouchableStyle = () => {
    const {
      circular,
      autoWidth,
      style,
    } = this.props
    return [
      styles.container,
      circular && { borderRadius: this.state.borderRadius },
      autoWidth && { width: this.state.width },
      style,
    ]
  }

  protected renderContent = () => {
    const {
      circular,
      autoWidth,
      style,
      imageStyle,
      source,
      onPress,
      activeOpacity,
      isLoading,
      ...remainingProps
    } = this.props
    return (
      <Image
        source={source}
        style={[styles.image, imageStyle]}
        {...remainingProps}
      />
    )
  }
}


export default ImageButton
