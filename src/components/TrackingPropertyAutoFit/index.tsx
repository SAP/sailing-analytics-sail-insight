import React from 'react'
import {
  View, ViewProps,
} from 'react-native'

import TrackingProperty from 'components/TrackingProperty'
import { responsiveFontSize } from 'helpers/screen'


const valuePercentage = (titlePercentage: number) => 0.90 - titlePercentage
const VALUE_TO_UNIT = 0.36

class TrackingPropertyAutoFit extends React.Component<ViewProps & {
  title: string,
  value: string,
  unit?: string,
  titlePercentage?: number,
  tendency?: 'up' | 'down',
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

  public textStyles = (height?: number) => {
    if (!height) {
      return {}
    }
    const { titlePercentage = 0.18 } = this.props
    const valueSize = responsiveFontSize(valuePercentage(titlePercentage), height)
    const titleSize = responsiveFontSize(titlePercentage, height)
    const unitSize = valueSize * VALUE_TO_UNIT
    return {
      valueStyle: { fontSize: Math.min(valueSize, 70) },
      titleStyle: { fontSize: Math.min(titleSize, 20) },
      unitFontSize: { fontSize: unitSize },
    }
  }

  public render() {
    const { style, title, value, unit, ...remainingProps } = this.props
    const textStyles = this.textStyles(this.state.containerHeight)
    return (
      <View
        style={style}
        onLayout={this.onContainerLayout}
      >
        <TrackingProperty
          title={title}
          value={value}
          unit={unit}
          {...textStyles}
          {...remainingProps}
        />
      </View>
    )
  }
}

export default TrackingPropertyAutoFit
