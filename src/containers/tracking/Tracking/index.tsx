import { get } from 'lodash'
import React from 'react'
import { Alert, BackHandler, View } from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import timer from 'react-native-timer'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import { stopTracking, StopTrackingAction } from 'actions/tracking'
import { durationText } from 'helpers/date'
import Logger from 'helpers/Logger'
import { degToCompass } from 'helpers/physics'
import { openSAPWebsite } from 'helpers/user'
import I18n from 'i18n'
import { CheckIn } from 'models'
import { navigateBack, navigateToLeaderboard, navigateToSetWind } from 'navigation'
import { getBoat } from 'selectors/boat'
import { getTrackedCheckIn } from 'selectors/checkIn'
import { getCompetitor } from 'selectors/competitor'
import { getTrackedCompetitorLeaderboardRank } from 'selectors/leaderboard'
import { getLocationStats, getLocationTrackingStatus, LocationStats } from 'selectors/location'
import { getMark } from 'selectors/mark'
import { getLeaderboardEnabledSetting } from 'selectors/settings'

import ConnectivityIndicator from 'components/ConnectivityIndicator'
import ImageButton from 'components/ImageButton'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TrackingProperty from 'components/TrackingProperty'
import TrackingPropertyAutoFit from 'components/TrackingPropertyAutoFit'

import { button, container } from 'styles/commons'
import styles from './styles'


const EMPTY_VALUE = '-'
const EMPTY_DURATION_TEXT = '00:00:00'

class Tracking extends React.Component<{
  stopTracking: StopTrackingAction,
  trackingStats: LocationStats,
  checkInData: CheckIn,
  trackedContextName?: string,
  trackedRank?: number,
  leaderboardEnabled?: boolean,
} > {
  public state = {
    isLoading: false,
    durationText: EMPTY_DURATION_TEXT,
    buttonText: I18n.t('caption_stop').toUpperCase(),
  }

  public componentDidMount() {
    timer.setInterval(this, 'tracking_timer', this.handleTimerEvent, 1000)
    KeepAwake.activate()
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  public componentWillUnmount() {
    timer.clearInterval(this)
    KeepAwake.deactivate()
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }

  public render() {
    const {
      trackingStats,
      checkInData,
      trackedContextName,
      trackedRank,
      leaderboardEnabled,
    } = this.props

    const speedOverGround = trackingStats.speedInKnots ? trackingStats.speedInKnots.toFixed(1) : EMPTY_VALUE
    const courseOverGround = trackingStats.headingInDeg ? `${trackingStats.headingInDeg.toFixed(0)}°` : EMPTY_VALUE
    const distance = trackingStats.distance ? trackingStats.distance.toFixed(0) : '0'

    return (
      <View style={[container.main]}>
        <ConnectivityIndicator style={styles.connectivity}/>
        {trackedContextName && <Text style={styles.contextName}>{trackedContextName}</Text>}
        <View style={[container.mediumHorizontalMargin, styles.container]}>
          <View style={styles.propertyRow}>
            <View>
              <TrackingPropertyAutoFit
                title={I18n.t('text_tracking_sog')}
                value={speedOverGround}
                unit={I18n.t('text_tracking_unit_knots')}
              />
            </View>
            {leaderboardEnabled &&
              <View
                style={[styles.rightPropertyContainer]}
              >
                <TrackingProperty
                  title={I18n.t('text_tracking_rank')}
                  value={`${trackedRank || EMPTY_VALUE}`}
                  onPress={this.onLeaderboardPress}
                />
              </View>
            }
          </View>
          <View style={[container.stretchContent]}>
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
                value={this.state.durationText || EMPTY_DURATION_TEXT}
              />
              <TrackingProperty
                style={styles.property}
                title={I18n.t('text_tracking_distance')}
                value={distance}
                unit={I18n.t('text_tracking_unit_meters')}
              />
            </View>
            <View
              style={[
                styles.rightPropertyContainer,
                checkInData.isSelfTracking ? undefined : styles.singleValue,
              ]}
            >
              {
                !checkInData.isSelfTracking ? null :
                <TrackingProperty
                  style={styles.windProperty}
                  title={I18n.t('text_tracking_wind')}
                  onPress={this.onSetWindPress}
                  valueStyle={styles.windValue}
                  {...this.createWindProps()}
                />
              }
              <TrackingProperty
                style={styles.property}
                title={I18n.t('text_tracking_gps_accuracy')}
                value={`${trackingStats.locationAccuracy || EMPTY_VALUE}`}
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
          {this.state.buttonText}
        </TextButton>
        <ImageButton
          style={styles.tagLine}
          source={Images.corporateIdentity.sapTagLine}
          activeOpacity={1.0}
          onPress={openSAPWebsite}
        />
      </View>
    )
  }

  protected handleBackButton = () => {
    return true
  }

  protected handleTimerEvent = () => {
    const { trackingStats } = this.props
    this.setState({ durationText: durationText(trackingStats.startedAt) })
  }

  protected onStopTrackingPress = async () => {
    await this.setState({ isLoading: true })
    try {
      timer.clearInterval(this)
      await this.props.stopTracking(this.props.checkInData)
      navigateBack()
    } catch (err) {
      Logger.debug('onStopTrackingPress Error', err)
      this.setState({ buttonText: I18n.t('caption_resend').toUpperCase() })
      Alert.alert(I18n.t('error_tracking_resend_info_title'), I18n.t('error_tracking_resend_info_text'))
    } finally {
      this.setState({ isLoading: false })
    }
  }

  protected onLeaderboardPress = () => {
    navigateToLeaderboard()
  }

  protected onSetWindPress = () => {
    const { trackingStats } = this.props
    if (!trackingStats || !trackingStats.lastLatitude || !trackingStats.lastLongitude) {
      Alert.alert(
        I18n.t('caption_set_wind'),
        I18n.t('text_set_wind_missing_data'),
      )
      return
    }
    navigateToSetWind({
      speedInKnots: trackingStats.lastWindSpeedInKnots,
      directionInDeg: trackingStats.lastWindDirection,
    })
  }

  protected createWindProps() {
    const { trackingStats } = this.props
    if (!trackingStats || !trackingStats.lastWindDirection || !trackingStats.lastWindSpeedInKnots) {
      return { value: I18n.t('caption_set_wind').toUpperCase() }
    }
    return {
      value: `${degToCompass(trackingStats.lastWindDirection)} ${Math.round(trackingStats.lastWindSpeedInKnots)}`,
      unit: I18n.t('text_tracking_unit_knots'),
    }
  }
}

const mapStateToProps = (state: any) => {
  const checkInData = getTrackedCheckIn(state) || {}
  return {
    checkInData,
    locationTrackingStatus: getLocationTrackingStatus(state),
    trackingStats: getLocationStats(state) || {},
    trackedContextName: get(
      getBoat(checkInData.boatId)(state) ||
      getCompetitor(checkInData.competitorId)(state) ||
      getMark(checkInData.markId)(state),
      'name',
    ),
    trackedRank: getTrackedCompetitorLeaderboardRank(state),
    leaderboardEnabled: getLeaderboardEnabledSetting(state),
  }
}

export default connect(mapStateToProps, { stopTracking })(Tracking)
