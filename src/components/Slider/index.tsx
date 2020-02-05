import React from 'react'
import { ViewStyle } from 'react-native'
import RNSlider from '@react-native-community/slider'

import { $primaryInactiveColor, $primaryTextColor } from 'styles/colors'
import styles from './styles'


class Slider extends React.Component<{
  style?: ViewStyle,
  thumbStyle?: ViewStyle,
  trackStyle?: ViewStyle,
  thumbTintColor?: string,
  minimumTrackTintColor?: string,
  maximumTrackTintColor?: string,
  step?: number,
  onValueChange?: (value: number) => void,
  onSlidingComplete?: () => void,
  value: number,
  minimumValue: number,
  maximumValue: number,
} > {

  public render() {
    const {
      style,
      thumbTintColor,
      thumbStyle,
      trackStyle,
      minimumTrackTintColor,
      maximumTrackTintColor,
      ...remainingProps
    } = this.props
    return (
      <RNSlider
        style={style}
        thumbTintColor={thumbTintColor || $primaryTextColor}
        thumbStyle={[styles.thumbStyle, thumbStyle]}
        trackStyle={[styles.trackStyle, trackStyle]}
        minimumTrackTintColor={minimumTrackTintColor || $primaryTextColor}
        maximumTrackTintColor={maximumTrackTintColor || $primaryInactiveColor}
        thumbTouchSize={{ width: 40, height: 40 }}
        {...remainingProps}
      />
    )
  }
}

export default Slider
