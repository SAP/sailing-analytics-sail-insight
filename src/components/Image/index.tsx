import { StyleSheetType } from 'helpers/types'
import { isEmpty, isNumber, isString } from 'lodash'
import React from 'react'
import {
  Image as RNImage,
  ImageBackground as RNImageBackground,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'


class Image extends React.Component<{
  source: ImageSourcePropType,
  style?: StyleSheetType,
  disableCache?: boolean,
} > {

  public imageSource = (source: any) => {
    if (isString(source)) {
      return !isEmpty(source) ? { uri: source } : null
    }
    return source
  }

  public renderLocalImage = () => {
    const { children, style, source, ...remainingProps } = this.props
    const ImageComponent = children ? RNImageBackground : RNImage
    return (
      <ImageComponent
        style={style}
        source={this.imageSource(source)}
        {...remainingProps}
      >
        {children}
      </ImageComponent>
    )
  }

  public renderCachedImage = () => {
    const { children, style, source, ...remainingProps } = this.props

    const convertedSource = this.imageSource(source)
    const { resizeMode = FastImage.resizeMode.contain, ...strippedStyle } = style

    return children ? (
      <View style={strippedStyle}>
        <FastImage
          style={StyleSheet.absoluteFill}
          source={convertedSource}
          resizeMode={resizeMode}
          {...remainingProps}
        />
        {children}
      </View>
    ) : (
      <FastImage
        style={strippedStyle}
        source={convertedSource}
        resizeMode={resizeMode}
        {...remainingProps}
      />
    )
  }

  public render() {
    const { source, disableCache = false } = this.props
    return isNumber(source) || disableCache ? this.renderLocalImage() : this.renderCachedImage()
  }
}

export default Image
