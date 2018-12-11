import React from 'react'
import { Alert, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import { sendWind, SendWindAction } from 'actions/wind'
import { degToCompass, speedToWindClassification } from 'helpers/physics'
import { getErrorDisplayMessage } from 'helpers/texts'
import I18n from 'i18n'
import { WindFix } from 'models'
import { navigateBack } from 'navigation'
import { getCustomScreenParamData } from 'navigation/utils'

import ImageButton from 'components/ImageButton'
import ScrollContentView from 'components/ScrollContentView'
import Slider from 'components/Slider'
import SpaceEvenlyContainer from 'components/SpaceEvenlyContainer'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TrackingProperty from 'components/TrackingProperty'

import { button, container } from 'styles/commons'
import { registration } from 'styles/components'
import styles from './styles'


class SetWind extends React.Component<ViewProps & {
  sendWind: SendWindAction,
  initialWindFix?: WindFix,
}> {

  public state = {
    windAngleInDeg: (this.props.initialWindFix && this.props.initialWindFix.directionInDeg) || 180,
    windSpeedInKnots: (this.props.initialWindFix && this.props.initialWindFix.speedInKnots) || 12,
    isLoading: false,
  }

  public renderInfoContainer(title: string, value: string, meta: string, valueUnit?: string) {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title.toLocaleUpperCase()}</Text>
        <TrackingProperty value={value} valueStyle={styles.infoValue} unit={valueUnit}/>
        <Text style={styles.metaDisplay}>{meta}</Text>
      </View>
    )
  }

  public render() {
    const { windAngleInDeg, windSpeedInKnots, isLoading } = this.state
    return (
      <ScrollContentView style={container.largeHorizontalPadding}>
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
            isLoading={isLoading}
          >
            {I18n.t('caption_done')}
          </TextButton>
        </View>
      </ScrollContentView>
    )
  }

  protected onSetWindPress = async () => {
    const { windSpeedInKnots, windAngleInDeg } = this.state
    try {
      this.setState({ isLoading: true })
      await this.props.sendWind(windAngleInDeg, windSpeedInKnots)
      navigateBack()
    } catch (err) {
      Alert.alert(getErrorDisplayMessage(err))
    } finally {
      this.setState({ isLoading: false })
    }
  }

  protected handleAngleChange = (value: number) => {
    this.setState({ windAngleInDeg:  value })
  }

  protected handleSpeedChange = (addition: number) => () => {
    this.setState({ windSpeedInKnots: this.state.windSpeedInKnots + addition })
  }
}

const mapStateToProps = (state: any, props: any) => ({
  initialWindFix: getCustomScreenParamData(props),
})

export default connect(mapStateToProps, { sendWind })(SetWind)
