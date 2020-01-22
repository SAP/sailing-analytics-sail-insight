import React from 'react'
import {
  Image,
  ImageSourcePropType,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
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
  rightIcon?: ImageSourcePropType,
  allowFontScaling?: boolean
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
      iconStyle,
      onPress,
      titlePosition = 'top',
      allowFontScaling = false
    } = this.props

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
            allowFontScaling={allowFontScaling}
            ellipsizeMode="tail"
          >
            {title && title}
          </Text>
        }
        <View style={styles.valueContainer} onLayout={this.onValueContainerLayout}>
          <View style={styles.innerValueContainer}>
            <Text style={[styles.value, valueStyle]} allowFontScaling={allowFontScaling}>
              {value}
              {
                unit &&
                <Text
                  style={[styles.unit, unitStyle]}
                  allowFontScaling={allowFontScaling}
                >
                  {` ${unit.toUpperCase()}`}
                </Text>
              }
            </Text>
            {onPress && <Image source={Images.actions.arrowRight} style={[styles.actionIcon, iconStyle]}/>}
          </View>
          {this.renderIcon()}
        </View>
      </TouchableOpacity>
    )
  }

  protected renderIcon = () => {
    const {
      tendency,
      rightIcon,
    } = this.props

    const iconSize = this.state.valueContainerHeight && (this.state.valueContainerHeight * 0.6)
    const iconStyle = iconSize && {
      padding: iconSize / 4,
      width: iconSize,
      height: iconSize,
    }
    const tendencyIconStyle = iconSize && {
      borderRadius: iconSize / 2,
    }

    return tendency || rightIcon ? (
      <View
        style={[
          styles.rightIconContainer,
          iconStyle,
          tendency && ([
            tendencyIconStyle,
            tendency === 'up' ? styles.tendencyIconUp : styles.tendencyIconDown,
          ]),
        ]}
      >
        <Image
          style={styles.rightIcon}
          source={rightIcon || (tendency === 'up' ? Images.info.arrowUp : Images.info.arrowDown)}
        />
      </View>
    ) : null
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
