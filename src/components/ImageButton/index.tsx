import React from 'react'
import { Image, TouchableOpacity } from 'react-native'

import { $defaultImageButtonSize } from 'styles/dimensions'

import { ImageSource } from 'helpers/types'
import styles from './styles'


class ImageButton extends React.Component<{
  style?: any,
  source: ImageSource,
  onPress: () => void,
  circular: boolean,
  autoWidth: boolean,
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
    const touchableStyle = [
      styles.containerStyle,
      this.props.circular && { borderRadius: this.state.borderRadius },
      this.props.autoWidth && { width: this.state.width },
      this.props.style,
    ]
    return (
      <TouchableOpacity
        onLayout={this.handleContentSizeChange}
        style={touchableStyle}
        onPress={this.props.onPress}
      >
        <Image
          source={this.props.source}
          style={styles.imageStyle}
        />
      </TouchableOpacity>
    )
  }
}


export default ImageButton
