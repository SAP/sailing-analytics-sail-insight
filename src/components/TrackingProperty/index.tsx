import React from 'react'
import {
  Image, TextStyle, TouchableOpacity, View, ViewProps,
} from 'react-native'

import Images from '@assets/Images'
import styles from './styles'

import Text from 'components/Text'


class TrackingProperty extends React.Component<ViewProps & {
  title?: string,
  value: string,
  unit?: string,
  titleStyle?: TextStyle,
  valueStyle?: TextStyle,
  unitStyle?: TextStyle,
  onPress?: () => void,
  tendency?: 'up' | 'down',
  titlePosition?: 'top' | 'left',
} > {

  public state: {valueContainerHeight?: number} = { valueContainerHeight: undefined }

  public render() {
    const {
      style,
      title,
      value,
      unit,
      titleStyle,
      valueStyle,
      unitStyle,
      onPress,
      tendency,
      titlePosition = 'top',
    } = this.props

    const tendencyIconSize = this.state.valueContainerHeight && (this.state.valueContainerHeight * 0.6)
    const tendencyIconStyle = tendencyIconSize && {
      padding: tendencyIconSize / 4,
      width: tendencyIconSize,
      height: tendencyIconSize,
      borderRadius: tendencyIconSize / 2,
    }

    const containerStyle = titlePosition === 'left' ? styles.titleLeftContainer : undefined

    return (
      <TouchableOpacity
        style={[containerStyle, style]}
        onPress={onPress}
        disabled={!onPress}
      >
        {
          title &&
          <Text
            style={[styles.title, titleStyle]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title && title.toUpperCase()}
          </Text>
        }
        <View style={styles.valueContainer} onLayout={this.onValueContainerLayout}>
          <View style={styles.innerValueContainer}>
            <Text style={[styles.value, valueStyle]}>
              {value}
              {
                unit &&
                <Text
                  style={[styles.unit, unitStyle]}
                >
                  {` ${unit.toUpperCase()}`}
                </Text>
              }
            </Text>
            {onPress && <Image source={Images.actions.arrowRight} style={styles.actionIcon}/>}
          </View>
          {
            tendency &&
            <View
              style={[
                styles.tendencyIconContainer,
                tendency === 'up' ? styles.tendencyIconUp : styles.tendencyIconDown,
                tendencyIconStyle,
              ]}
            >
              <Image
                style={styles.tendencyIcon}
                source={tendency === 'up' ? Images.info.arrowUp : Images.info.arrowDown}
              />
            </View>
          }
        </View>
      </TouchableOpacity>
    )
  }

  private onValueContainerLayout = ({ nativeEvent }: any = {}) => {
    if (
      !nativeEvent ||
      !nativeEvent.layout ||
      !nativeEvent.layout.height
    ) {
      return
    }
    this.setState({ valueContainerHeight: nativeEvent.layout.height })
  }
}

export default TrackingProperty
