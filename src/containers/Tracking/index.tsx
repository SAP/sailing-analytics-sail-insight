import React from 'react'
import { Linking, View } from 'react-native'
import { connect } from 'react-redux'

import { checkIn } from 'actions/checkIn'
import I18n from 'i18n'
import { buttons, container } from 'styles/commons'

import GradientContainer from 'components/GradientContainer'
import RegattaItem from 'components/RegattaItem'
import TextButton from 'components/TextButton'

import {
  startLocationTracking,
  stopLocationTracking,
} from 'actions/locations'
import { getLocationTrackingStatus } from 'selectors/location'
import CheckInService from 'services/CheckInService'
import { LocationTrackingStatus } from 'services/LocationService'
import styles from './styles'


class Tracking extends React.Component<{
  checkIn: (url: string) => void,
  startLocationTracking: (leaderboardName: string, eventId: string) => void,
  stopLocationTracking: () => void,
  locationTrackingStatus?: string,
  checkInData: any,
} > {

  public onSuccess = (url: string) => {
    this.props.checkIn(url)
  }

  public onTrackingPress = () => {
    if (this.props.locationTrackingStatus === LocationTrackingStatus.RUNNING) {
      this.props.stopLocationTracking()
    } else {
      const { checkInData } = this.props
      this.props.startLocationTracking(checkInData.leaderboardName, checkInData.eventId)
    }
  }

  public onEventPress = () => {
    Linking.openURL(CheckInService.eventUrl(this.props.checkInData))
  }

  public onLeaderboardPress = () => {
    Linking.openURL(CheckInService.leaderboardUrl(this.props.checkInData))
  }

  public render() {
    const isRunning = this.props.locationTrackingStatus === LocationTrackingStatus.RUNNING
    return (
      <GradientContainer style={[container.main, styles.container]}>
        <RegattaItem
          style={{ width: '66%', backgroundColor: 'transparent' }}
          regatta={this.props.checkInData}
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
          {isRunning ? I18n.t('caption_stop_tracking') : I18n.t('caption_start_tracking')}
        </TextButton>
      </GradientContainer>
    )
  }
}

const mapStateToProps = (state: any, props: any) => ({
  locationTrackingStatus: getLocationTrackingStatus(state),
  checkInData: props.navigation.state.params,
})

export default connect(mapStateToProps, {
  checkIn,
  startLocationTracking,
  stopLocationTracking,
})(Tracking)
