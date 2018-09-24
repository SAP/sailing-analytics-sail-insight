import React from 'react'
import { Alert, View } from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import timer from 'react-native-timer'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import {  stopLocationTracking } from 'actions/locations'
import { durationText } from 'helpers/date'
import { getUnknownErrorMessage } from 'helpers/texts'
import I18n from 'i18n'
import { navigateBack, navigateToManeuverMonitor, navigateToSetWind } from 'navigation'
import { getLocationStats, getLocationTrackingStatus, LocationStats } from 'selectors/location'

import ImageButton from 'components/ImageButton'
import TextButton from 'components/TextButton'
import TrackingProperty from 'components/TrackingProperty'
import TrackingPropertyAutoFit from 'components/TrackingPropertyAutoFit'

import ConnectivityIndicator from 'components/ConnectivityIndicator'
import { button, container } from 'styles/commons'
import styles from './styles'


const EMPTY_VALUE = '-'

class Tracking extends React.Component<{
  stopLocationTracking: () => void,
  trackingStats: LocationStats,
  checkInData: any,
} > {
  public state = {
    isLoading: false,
    durationText: '00:00:00',
  }

  public componentDidMount() {
    timer.setInterval(this, 'tracking_timer', this.handleTimerEvent, 1000)
    KeepAwake.activate()
  }

  public componentWillUnmount() {
    timer.clearInterval(this)
    KeepAwake.deactivate()
  }

  public handleTimerEvent = () => {
    const { trackingStats } = this.props
    this.setState({ durationText: durationText(trackingStats.startedAt) })
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

  public onSetWindPress = () => {
    navigateToSetWind()
  }

  public render() {
    const { trackingStats }: any = this.props

    const speedOverGround = trackingStats.speedInKnots ? trackingStats.speedInKnots.toFixed(2) : EMPTY_VALUE
    const courseOverGround = trackingStats.headingInDeg ? `${trackingStats.headingInDeg.toFixed(2)}°` : EMPTY_VALUE
    const distance = trackingStats.distance ? trackingStats.distance.toFixed(2) : 0

    return (
      <View style={[container.main]}>
        <ConnectivityIndicator style={styles.connectivity}/>
        <View style={[container.mediumHorizontalMargin, styles.container]}>
          <View style={[container.stretchContent]}>
            <TrackingPropertyAutoFit
              style={styles.dynamicPropertyContainer}
              title={I18n.t('text_tracking_sog')}
              value={speedOverGround}
              unit={I18n.t('text_tracking_unit_knots')}
            />
            <TrackingPropertyAutoFit
              style={[styles.dynamicPropertyContainer, styles.property]}
              title={I18n.t('text_tracking_cog')}
              value={courseOverGround}
            />
          </View>
          <View style={styles.propertyRow}>
            <View>
              <TrackingProperty
                title={I18n.t('text_tracking_time')}
                value={this.state.durationText}
              />
              <TrackingProperty
                style={styles.property}
                title={I18n.t('text_tracking_distance')}
                value={distance}
                unit={I18n.t('text_tracking_unit_meters')}
              />
            </View>
            <View>
              <TrackingProperty
                title={I18n.t('text_tracking_wind')}
                value={I18n.t('caption_set_wind').toUpperCase()}
                onPress={this.onSetWindPress}
              />
              <TrackingProperty
                style={styles.property}
                title={I18n.t('text_tracking_gps_accuracy')}
                value={trackingStats.locationAccuracy || EMPTY_VALUE}
                unit={I18n.t('text_tracking_unit_meters')}
              />
            </View>
          </View>
        </View>

        <TextButton
          style={[button.trackingAction, styles.stopButton]}
          textStyle={button.trackingActionText}
          onPress={this.onStopTrackingPress}
          isLoading={this.state.isLoading}
        >
          {I18n.t('caption_stop').toUpperCase()}
        </TextButton>
        <ImageButton
          style={styles.tagLine}
          source={Images.corporateIdentity.sapTagLine}
          onPress={navigateToManeuverMonitor}
          activeOpacity={1.0}
        />
      </View>
    )
  }
}

const mapStateToProps = (state: any, props: any) => ({
  locationTrackingStatus: getLocationTrackingStatus(state),
  trackingStats: getLocationStats(state) || {},
  checkInData: props.navigation.state.params,
})

export default connect(mapStateToProps, { stopLocationTracking })(Tracking)
