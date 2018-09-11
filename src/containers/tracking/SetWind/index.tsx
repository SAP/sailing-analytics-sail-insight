import React from 'react'
import { View } from 'react-native'

import Images from '@assets/Images'
import { degToCompass, speedToWindClassification } from 'helpers/physics'
import I18n from 'i18n'
import { button, container } from 'styles/commons'
import { registration } from 'styles/components'
import styles from './styles'

import ImageButton from 'components/ImageButton'
import ScrollContentView from 'components/ScrollContentView'
import Slider from 'components/Slider'
import SpaceEvenlyContainer from 'components/SpaceEvenlyContainer'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TrackingProperty from 'components/TrackingProperty'


class SetWind extends React.Component<{
  navigation: any,
} > {

  public state: {windAngleInDeg: number, windSpeedInKnots: number} = {
    windAngleInDeg: 180,
    windSpeedInKnots: 12,
  }

  public onSetWindPress = () => {
    // TODO: set wind and return to tracking screen
  }

  public handleAngleChange = (value: number) => {
    this.setState({ windAngleInDeg:  value })
  }

  public handleSpeedChange = (addition: number) => () => {
    this.setState({ windSpeedInKnots: this.state.windSpeedInKnots + addition })
  }

  public renderInfoContainer(title: string, value: string, meta: string, valueUnit?: string) {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title.toLocaleUpperCase()}</Text>
        <TrackingProperty value={value} valueFontSize={56} unit={valueUnit}/>
        <Text style={styles.metaDisplay}>{meta}</Text>
      </View>
    )
  }

  public render() {
    const { windAngleInDeg, windSpeedInKnots } = this.state
    return (
      <ScrollContentView style={container.mediumHorizontalPadding}>
        <View style={[container.stretchContent, styles.controlsContainer]}>
          <View>
            {
              this.renderInfoContainer(
                I18n.t('caption_angle'),
                `${windAngleInDeg}°`,
                degToCompass(this.state.windAngleInDeg),
              )
            }
            <SpaceEvenlyContainer style={styles.sliderCaptionContainer}>
              <Text>{'0°'}</Text>
              <Text>{'180°'}</Text>
              <Text>{'360°'}</Text>
            </SpaceEvenlyContainer>
            <Slider
              value={this.state.windAngleInDeg}
              minimumValue={0}
              maximumValue={360}
              step={1}
              onValueChange={this.handleAngleChange}
            />
          </View>
          <View style={styles.speedContainer}>
            <ImageButton
              style={styles.speedButton}
              source={Images.actions.decrease}
              onPress={this.handleSpeedChange(-1)}
            />
            {
              this.renderInfoContainer(
                I18n.t('caption_speed'),
                windSpeedInKnots.toString(),
                speedToWindClassification(this.state.windSpeedInKnots),
                I18n.t('text_tracking_unit_knots'),
              )
            }
            <ImageButton
              style={styles.speedButton}
              source={Images.actions.add}
              onPress={this.handleSpeedChange(1)}
            />
          </View>
        </View>
        <View style={styles.containerButton}>
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.onSetWindPress}
          >
            {I18n.t('caption_done')}
          </TextButton>
        </View>
      </ScrollContentView>
    )
  }
}

export default SetWind
