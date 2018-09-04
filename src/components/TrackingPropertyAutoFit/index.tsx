import React from 'react'
import {
  View,
} from 'react-native'

import { StyleSheetType } from 'helpers/types'

import TrackingProperty from 'components/TrackingProperty'


const TITLE_PERCENTAGE = 0.27
const VALUE_PERCENTAGE = 0.95 - TITLE_PERCENTAGE
const VALUE_TO_UNIT = 0.5

class TrackingPropertyAutoFit extends React.Component<{
  style?: StyleSheetType,
  title: string,
  value: string,
  unit?: string,
} > {

  public state = { containerHeight: undefined }

  public onContainerLayout = ({ nativeEvent }: any = {}) => {
    if (
      this.state.containerHeight ||
      !nativeEvent ||
      !nativeEvent.layout ||
      !nativeEvent.layout.height
    ) {
      return
    }
    this.setState({ containerHeight: nativeEvent.layout.height })
  }

  public responsiveFontSize = (percentage: number, height: number) => {
    return Math.sqrt((height * height)) * percentage
  }

  public fontSizes = (height?: number) => {
    if (!height) {
      return {}
    }
    const valueFontSize = this.responsiveFontSize(VALUE_PERCENTAGE, height)
    return {
      valueFontSize,
      titleFontSize: this.responsiveFontSize(TITLE_PERCENTAGE, height),
      unitFontSize: valueFontSize * VALUE_TO_UNIT,
    }
  }

  public render() {
    const { style, title, value, unit } = this.props
    const fontSizes = this.fontSizes(this.state.containerHeight)
    return (
      <View
        style={style}
        onLayout={this.onContainerLayout}
      >
        <TrackingProperty
          title={title}
          value={value}
          unit={unit}
          {...fontSizes}
        />
      </View>
    )
  }
}

export default TrackingPropertyAutoFit
