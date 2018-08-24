import React from 'react'
import { Alert, Text } from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import timer from 'react-native-timer'
import { connect } from 'react-redux'

import GradientContainer from 'components/GradientContainer'
import TextButton from 'components/TextButton'
import { buttons, container } from 'styles/commons'
import styles from './styles'

import {  stopLocationTracking } from 'actions/locations'
import { uiDurationText } from 'helpers/date'
import { getUnknownErrorMessage } from 'helpers/texts'
import I18n from 'i18n'
import { navigateBack, navigateToAppSettings } from 'navigation'
import { getLocationStats, getLocationTrackingStatus } from 'selectors/location'


class Tracking extends React.Component<{
  navigation: any,
  stopLocationTracking: () => void,
  trackingStats: any,
  checkInData: any,
} > {
  public state = {
    isLoading: false,
    durationText: '-',
  }

  public componentDidMount() {
    const { checkInData } = this.props
    this.props.navigation.setParams({
      heading: checkInData.event && checkInData.event.name,
      subHeading: checkInData.leaderboardName,
      onOptionsPressed: this.onOptionsPressed,
    })
    timer.setInterval(this, 'tracking_timer', this.handleTimerEvent, 500)
    KeepAwake.activate()
  }

  public componentWillUnmount() {
    timer.clearInterval(this)
    KeepAwake.deactivate()
  }

  public handleTimerEvent = () => {
    const { trackingStats } = this.props
    this.setState({ durationText: uiDurationText(trackingStats.startedAt) })
  }

  public onOptionsPressed = () => {
    navigateToAppSettings()
  }

  public onStopTrackingPress = async () => {
    await this.setState({ isLoading: true })
    try {
      await this.props.stopLocationTracking()
      navigateBack()
    } catch (err) {
      Alert.alert(getUnknownErrorMessage())
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public render() {
    const { trackingStats }: any = this.props
    return (
      <GradientContainer style={container.main}>
        <Text style={styles.informationItem}>
          {`${I18n.t('text_tracking_time')}: ${this.state.durationText}`}
        </Text>
        <Text style={styles.informationItem}>
          {`${I18n.t('text_accuracy')}: ${trackingStats.locationAccuracy}`}
        </Text>
        <Text style={styles.informationItem}>
          {`${I18n.t('text_speed_knots')}: ${trackingStats.speedInKnots ? trackingStats.speedInKnots.toFixed(2) : '-'}`}
        </Text>
        <Text style={styles.informationItem}>
          {`${I18n.t('text_bearing_deg')}: ${trackingStats.headingInDeg ? trackingStats.headingInDeg.toFixed(2) : '-'}`}
        </Text>
        <Text style={styles.informationItem}>
          {`${I18n.t('text_unsent_gps_fixes')}: ${trackingStats.unsentGpsFixCount || 0}`}
        </Text>
        <TextButton
          textStyle={buttons.actionText}
          style={[buttons.actionFullWidth, styles.stopButton]}
          onPress={this.onStopTrackingPress}
          isLoading={this.state.isLoading}
        >
          {I18n.t('caption_stop_tracking')}
        </TextButton>
      </GradientContainer>
    )
  }
}

const mapStateToProps = (state: any, props: any) => ({
  locationTrackingStatus: getLocationTrackingStatus(state),
  trackingStats: getLocationStats(state) || {},
  checkInData: props.navigation.state.params,
})

export default connect(mapStateToProps, { stopLocationTracking })(Tracking)
