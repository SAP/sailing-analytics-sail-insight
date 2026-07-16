import { get } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { Alert, BackHandler, Image, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native'
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
import { getTrackedCheckIn } from 'selectors/checkIn'
import { getCompetitor } from 'selectors/competitor'
import { getTrackedCompetitorLeaderboardRank } from 'selectors/leaderboard'
import { getLocationStats, getLocationTrackingStatus, LocationStats } from 'selectors/location'
import { LocationTrackingStatus } from 'services/LocationService'
import { getMark } from 'selectors/mark'
import { isNetworkConnected } from 'selectors/network'

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
import {activateKeepAwake, deactivateKeepAwake} from "@sayem314/react-native-keep-awake";

const EMPTY_VALUE = '-'
const EMPTY_DURATION_TEXT = '00:00:00'

const Timer = ({ onUpdate }) => {
  const callbackRef = useRef(onUpdate)
  callbackRef.current = onUpdate

  useEffect(() => {
    const timer = setInterval(() => callbackRef.current(), 1000)
    return () => clearInterval(timer)
  }, [])

  return null
}

type RootStackParamList = { // RNU check
  WelcomeTracking: undefined;
  Leaderboard: undefined;
  SetWind: {
    data: {
      speedInKnots: number;
      directionInDeg: number;
    }
  };
  [key: string]: undefined | object;
};
type NavigationProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};
class Tracking extends React.Component<NavigationProps & {
  stopTracking: any,
  openLatestRaceTrackDetails: any,
  locationTrackingStatus?: any,
  trackingStats: LocationStats,
  checkInData: CheckIn,
  trackedContextName?: string,
  rank?: number,
  isNetworkConnected: boolean,
},  any > {
  private removeFocus?: () => void;
  private removeBlur?: () => void;
  private backHandlerSubscription?: { remove: () => void };
  public state = {
    isLoading: false,
    durationText: EMPTY_DURATION_TEXT,
    buttonText: I18n.t('caption_stop').toUpperCase(),
    stoppingFailed: false,
    isFocused: false
  }

  public componentDidMount() {
    // Run when the screen becomes focused
    this.removeFocus = this.props.navigation.addListener('focus', () => {
      this.backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
      this.setState({ isFocused: true });
      activateKeepAwake();
    });

    // Run when the screen loses focus
    this.removeBlur = this.props.navigation.addListener('blur', () => {
      if (this.backHandlerSubscription) this.backHandlerSubscription.remove();
      this.setState({ isFocused: false });
      deactivateKeepAwake();
    });
  }

  public componentDidUpdate(prevProps: any) {
    // Tracking can stop outside this screen (OS kills the service,
    // native enabled-change event) — leave the live view then instead
    // of showing a running timer while no fixes are recorded. Only an
    // explicit STOPPED counts: resetTrackingStatistics sets status to
    // null while a new session starts. The manual stop button navigates
    // itself (isLoading covers that flow).
    if (prevProps.locationTrackingStatus === LocationTrackingStatus.RUNNING &&
        this.props.locationTrackingStatus === LocationTrackingStatus.STOPPED &&
        !this.state.isLoading) {
      this.resetToWelcomeTracking()
    }
  }

  // Reset instead of navigate so the stack always ends up in the same
  // shape a fresh launch produces ([WelcomeTracking] only), regardless
  // of what is currently stacked — and without a transition animation.
  protected resetToWelcomeTracking = () => this.props.navigation.dispatch(
    CommonActions.reset({ index: 0, routes: [{ name: Screens.WelcomeTracking }] })
  )

  public componentWillUnmount() {
    if (this.backHandlerSubscription) this.backHandlerSubscription.remove();
    if (this.removeFocus) this.removeFocus();
    if (this.removeBlur) this.removeBlur();
    deactivateKeepAwake();
  }

  public render() {
    const {
      trackingStats,
      trackedContextName,
      rank,
    } = this.props

    const speedOverGround = trackingStats.speedInKnots ? trackingStats.speedInKnots.toFixed(1) : EMPTY_VALUE
    const distance = trackingStats.distance ? trackingStats.distance.toFixed(0) : '0'



    return (
      <ScrollContentView style={[container.main]}>
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
            <TrackingPropertyAutoFit
                style={styles.rank}
                titleStyle={styles.rankTitle}
                valueStyle={styles.rankText}
                iconStyle={styles.rankIcon}
                title={I18n.t('text_tracking_rank')}
                value={`${rank || EMPTY_VALUE}`}
                onPress={this.onLeaderboardPress}
            />
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
        {this.state.isFocused && <Timer onUpdate={this.handleTimerEvent}/>}
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
      await this.props.stopTracking(this.props.checkInData)
      this.resetToWelcomeTracking()
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
    isNetworkConnected: isNetworkConnected(state)
  }
}

export default connect(
  mapStateToProps,
  { stopTracking, openLatestRaceTrackDetails })(
  Tracking)
