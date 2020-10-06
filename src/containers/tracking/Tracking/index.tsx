import { get } from 'lodash'
import React from 'react'
import { Alert, BackHandler, Image, View, TouchableOpacity } from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import SpinnerOverlay from 'react-native-loading-spinner-overlay'
import timer from 'react-native-timer'
import { connect } from 'react-redux'
import { NavigationEvents } from '@react-navigation/compat'
import * as Screens from 'navigation/Screens'
import Images from '@assets/Images'
import { openLatestRaceTrackDetails } from 'actions/navigation'
import { stopTracking } from 'actions/tracking'
import { durationText } from 'helpers/date'
import Logger from 'helpers/Logger'
import { showNetworkRequiredSnackbarMessage } from 'helpers/network'
import I18n from 'i18n'
import { CheckIn } from 'models'
import { getBoat } from 'selectors/boat'
import { getTrackedCheckIn, isLoadingCheckIn } from 'selectors/checkIn'
import { getCompetitor } from 'selectors/competitor'
import { getTrackedCompetitorLeaderboardRank } from 'selectors/leaderboard'
import { getLocationStats, getLocationTrackingStatus, LocationStats } from 'selectors/location'
import { getMark } from 'selectors/mark'
import { isNetworkConnected } from 'selectors/network'
import { getLeaderboardEnabledSetting } from 'selectors/settings'

import ConnectivityIndicator from 'components/ConnectivityIndicator'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TrackingProperty from 'components/TrackingProperty'
import TrackingPropertyAutoFit from 'components/TrackingPropertyAutoFit'
import LeaderboardFetcher from 'containers/session/Leaderboard/LeaderboardFetcher'

import { button, container } from 'styles/commons'
import styles from './styles'

import ScrollContentView from 'components/ScrollContentView';
import Toast from 'react-native-root-toast'
import { NavigationScreenProps } from 'react-navigation'

const EMPTY_VALUE = '-'
const EMPTY_DURATION_TEXT = '00:00:00'

class Tracking extends React.Component<NavigationScreenProps & {
  stopTracking: any,
  openLatestRaceTrackDetails: any,
  trackingStats: LocationStats,
  checkInData: CheckIn,
  trackedContextName?: string,
  rank?: number,
  leaderboardEnabled?: boolean,
  isNetworkConnected: boolean,
  isLoadingCheckIn?: boolean
} > {
  public state = {
    isLoading: false,
    durationText: EMPTY_DURATION_TEXT,
    buttonText: I18n.t('caption_stop').toUpperCase(),
    stoppingFailed: false,
  }

  public render() {
    const {
      trackingStats,
      checkInData,
      trackedContextName,
      rank,
      leaderboardEnabled,
      isLoadingCheckIn
    } = this.props

    const speedOverGround = trackingStats.speedInKnots ? trackingStats.speedInKnots.toFixed(1) : EMPTY_VALUE
    const courseOverGround = trackingStats.headingInDeg ? `${trackingStats.headingInDeg.toFixed(0)}°` : EMPTY_VALUE
    const distance = trackingStats.distance ? trackingStats.distance.toFixed(0) : '0'

    return (
      <ScrollContentView style={[container.main]}>
        <NavigationEvents
          onDidFocus={() => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
            timer.setInterval(this, 'tracking_timer', this.handleTimerEvent, 500)
            KeepAwake.activate()
          }}
          onWillBlur={() => {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
            timer.clearInterval(this)
            KeepAwake.deactivate()
          }}
        />
        <LeaderboardFetcher rankOnly />
        <ConnectivityIndicator style={styles.connectivity}/>
        {trackedContextName && <Text style={styles.contextName}>{trackedContextName}</Text>}
        <View style={styles.container}>
          <View style={styles.propertyReverseRow}>
            <TouchableOpacity onPress={this.handleSapButton}>
              <View style={{ justifyContent: 'flex-end' }}>
                <Image
                  style={styles.tagLine}
                  source={Images.defaults.sap_logo_insights}
                />
              </View>
            </TouchableOpacity>
            {leaderboardEnabled &&
              <TrackingPropertyAutoFit
                style={styles.rank}
                titleStyle={styles.rankTitle}
                valueStyle={styles.rankText}
                iconStyle={styles.rankIcon}
                title={I18n.t('text_tracking_rank')}
                value={`${rank || EMPTY_VALUE}`}
                onPress={this.onLeaderboardPress}
              />
            }
          </View>
          <View style={styles.property}>
            <View>
              <TrackingPropertyAutoFit
                style={styles.measurementContainer}
                titleStyle={styles.measurementTitle}
                valueStyle={styles.measurementValueBig}
                title={I18n.t('text_tracking_sog')}
                value={speedOverGround}
                unit={I18n.t('text_tracking_unit_knots')}
              />
            </View>
          </View>
          <View style={styles.propertiesTiles}>
            <View style={styles.propertiesRow}>
              <TrackingProperty
                style={[styles.measurementContainer, styles.propertyBottom, styles.leftPropertyContainer]}
                titleStyle={styles.measurementTitle}
                valueStyle={styles.measurementValue}
                title={I18n.t('text_tracking_time')}
                value={this.state.durationText || EMPTY_DURATION_TEXT}/>
              <TrackingProperty
                style={[styles.measurementContainer, styles.propertyBottom, styles.rightPropertyContainer]}
                titleStyle={styles.measurementTitle}
                valueStyle={styles.measurementValue}
                title={I18n.t('text_tracking_gps_accuracy')}
                value={`${trackingStats.locationAccuracy || EMPTY_VALUE}`}
                unit={I18n.t('text_tracking_unit_meters')}/>
            </View>
            <View style={styles.propertiesRow}>
              <TrackingProperty
                style={[styles.measurementContainer, styles.leftPropertyContainer]}
                titleStyle={styles.measurementTitle}
                valueStyle={styles.measurementValue}
                title={I18n.t('text_tracking_distance')}
                value={distance}
                unit={I18n.t('text_tracking_unit_meters')}/>
              <TrackingProperty
                style={[styles.measurementContainerStub, styles.rightPropertyContainer]}/>
            </View>
          </View>
        </View>

        <TextButton
          style={[button.actionFullWidth, container.largeHorizontalMargin, styles.stopButton]}
          textStyle={button.trackingActionText}
          onPress={this.onStopTrackingPress}
          isLoading={this.state.isLoading}>
          {this.state.buttonText}
        </TextButton>
        <SpinnerOverlay visible={isLoadingCheckIn} cancelable={false}/>
      </ScrollContentView>
    )
  }

  protected handleSapButton = () => {
    if (!this.props.isNetworkConnected) {
      showNetworkRequiredSnackbarMessage()
    } else {
      this.props.openLatestRaceTrackDetails(this.props.navigation)
    }
  }

  protected handleBackButton = () => true
  protected handleTimerEvent = () => {
    const {trackingStats} = this.props
    this.setState({ durationText: durationText(trackingStats.startedAt) })
  }

  protected stopTrackingConfirmationDialog = () => new Promise(resolve =>
    Alert.alert('', I18n.t('text_tracking_alert_stop_confirmation_message'),
      [
        { text: I18n.t('caption_cancel'), onPress: () => resolve(false) },
        { text: I18n.t('button_yes'), onPress: () => resolve(true) }
      ],
      { cancelable: true },
    )
  )

  protected onStopTrackingPress = async () => {
    if (!(await this.stopTrackingConfirmationDialog())) {
      return
    }

    await this.setState({ isLoading: true })
    try {
      timer.clearInterval(this)
      await this.props.stopTracking(this.props.checkInData)
      this.props.navigation.navigate(Screens.WelcomeTracking)
    } catch (err) {
      Logger.debug('onStopTrackingPress Error', err)
    } finally {
      this.setState({ isLoading: false })
      Toast.show(I18n.t('text_info_event_finished'), {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#E09D00',
        textColor: 'black',
      })
    }
  }

  protected onLeaderboardPress = () => {
    this.props.navigation.navigate(Screens.Leaderboard)
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
    this.props.navigation.navigate(Screens.SetWind, { data: {
      speedInKnots: trackingStats.lastWindSpeedInKnots,
      directionInDeg: trackingStats.lastWindDirection,
    } })
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
    rank: getTrackedCompetitorLeaderboardRank(state),
    leaderboardEnabled: getLeaderboardEnabledSetting(state),
    isNetworkConnected: isNetworkConnected(state),
    isLoadingCheckIn: isLoadingCheckIn(state)
  }
}

export default connect(
  mapStateToProps,
  { stopTracking, openLatestRaceTrackDetails })(
  Tracking)
