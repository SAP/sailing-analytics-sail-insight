import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, Linking } from 'react-native'

import I18n from 'i18n'
import { checkIn } from 'actions/checkIn'
import { container, buttons } from 'styles/commons'

import GradientContainer from 'components/GradientContainer'
import TextButton from 'components/TextButton'
import RegattaItem from 'components/RegattaItem'

import { LocationTrackingStatus } from 'services/LocationService'
import CheckInService from 'services/CheckInService'
import { getLocationTrackingStatus } from 'selectors/location'
import {
  startLocationTracking,
  stopLocationTracking,
} from 'actions/locations'
import styles from './styles'


class Tracking extends Component {
  static propTypes = {
    checkIn: PropTypes.func.isRequired,
    startLocationTracking: PropTypes.func.isRequired,
    stopLocationTracking: PropTypes.func.isRequired,
    locationTrackingStatus: PropTypes.string,
    checkInData: PropTypes.shape({}).isRequired,
  }

  static defaultProps = {
    locationTrackingStatus: null,
  }

  onSuccess = (url) => {
    this.props.checkIn(url)
  }

  onTrackingPress = () => {
    if (this.props.locationTrackingStatus === LocationTrackingStatus.RUNNING) {
      this.props.stopLocationTracking()
    } else {
      this.props.startLocationTracking(this.props?.checkInData?.leaderboardName)
    }
  }

  onEventPress = () => {
    Linking.openURL(CheckInService.eventUrl(this.props?.checkInData))
  }

  onLeaderboardPress = () => {
    Linking.openURL(CheckInService.leaderboardUrl(this.props?.checkInData))
  }

  render() {
    const isRunning = this.props.locationTrackingStatus === LocationTrackingStatus.RUNNING
    return (
      <GradientContainer style={[container.main, styles.container]}>
        <RegattaItem
          style={{ width: '66%', backgroundColor: 'transparent' }}
          regatta={this.props?.checkInData}
        />
        <View style={styles.detailButtonContainer}>
          <TextButton
            textStyle={buttons.actionText}
            style={[buttons.actionFullWidth, styles.detailButton]}
            onPress={this.onEventPress}
          >
            {I18n.t('caption_to_event')}
          </TextButton>
          <TextButton
            textStyle={buttons.actionText}
            style={[buttons.actionFullWidth, styles.detailButton]}
            onPress={this.onLeaderboardPress}
          >
            {I18n.t('caption_to_leaderboard')}
          </TextButton>
        </View>
        <TextButton
          textStyle={buttons.actionText}
          style={[buttons.actionFullWidth, isRunning ? { backgroundColor: 'red' } : null]}
          onPress={this.onTrackingPress}
        >
          {
            isRunning
              ? I18n.t('caption_stop_tracking')
              : I18n.t('caption_start_tracking')
          }
        </TextButton>
      </GradientContainer>
    )
  }
}

const mapStateToProps = (state, props) => ({
  locationTrackingStatus: getLocationTrackingStatus(state),
  checkInData: props?.navigation?.state?.params,
})

export default connect(mapStateToProps, {
  checkIn,
  startLocationTracking,
  stopLocationTracking,
})(Tracking)
