import { isEmpty, isNumber, isString } from 'lodash'
import React from 'react'
import {
  Image as RNImage,
  ImageBackground as RNImageBackground,
  ImageProps,
  ImageStyle,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native'
import FastImage, { FastImageProperties } from 'react-native-fast-image'
import { Circle } from 'react-native-progress'

import Images from '@assets/Images'
import { extractResizeModeFromStyle } from 'helpers/utils'

import { $secondaryTextColor } from 'styles/colors'
import styles from './styles'


class Image extends React.Component<ViewProps & FastImageProperties & ImageProps & {
  style?: ImageStyle | any,
  disableCache?: boolean,
} > {
  public state = {
    isLoading: false,
    hasFailed: false,
    progress: undefined,
  }

  public render() {
    const { source, disableCache = false } = this.props
    return isNumber(source) || disableCache ? this.renderLocalImage() : this.renderCachedImage()
  }

  protected renderCachedImage = () => {
    const { children, style, source, ...remainingProps } = this.props

    const convertedSource = this.imageSource(source)
    const { resizeMode = FastImage.resizeMode.contain, stripped } = extractResizeModeFromStyle(style)

    return (
      <View style={stripped}>
        <FastImage
          style={StyleSheet.absoluteFill}
          source={convertedSource}
          resizeMode={resizeMode}
          onLoadStart={this.onLoadStart}
          onLoadEnd={this.onLoadEnd}
          onError={this.onLoadError}
          onProgress={this.onProgress}
          {...remainingProps}
        />
        {children}
        {this.getIndicator()}
      </View>
    )
  }

  protected renderLocalImage = () => {
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

  protected getIndicator = () => {
    const indicator = this.state.isLoading && !this.state.hasFailed ? (
      <View style={styles.indicator}>
        <Circle
          size={16}
          progress={isNumber(this.state.progress) ? this.state.progress : 1}
          borderWidth={0}
          thickness={1}
          color={$secondaryTextColor}
          animated={true}
          indeterminate={!isNumber(this.state.progress)}
        />
      </View>
    ) : undefined
    return this.state.hasFailed ?
      <RNImage source={Images.info.error} style={[styles.indicator, styles.error]}/> :
      indicator
  }

  protected imageSource = (source: any) => {
    if (isString(source)) {
      return !isEmpty(source) ? { uri: source, priority: FastImage.priority.high } : null
    }
    return source
  }

  protected onLoadStart = () => {
    this.setState({ isLoading: true, hasFailed: false, progress: undefined })
  }

  protected onLoadEnd = () => {
    this.setState({ isLoading: false })
  }

  protected onLoadError = () => {
    this.setState({ hasFailed: true, isLoading: false, progress: undefined })
  }

  protected onProgress = (event: any) => {
    if (!event || !event.nativeEvent || event.nativeEvent.total === 0) {
      return
    }
    this.setState({ progress: event.nativeEvent.loaded / event.nativeEvent.total })
  }
}

export default Image
