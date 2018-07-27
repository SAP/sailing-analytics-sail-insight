import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import I18n from 'i18n'
import { checkIn } from 'actions/checkIn'
import { container, buttons } from 'styles/commons'

import GradientContainer from 'components/GradientContainer'
import TextButton from 'components/TextButton'

import LocationService, { LocationTrackingStatus } from 'services/LocationService'
import { getLocationTrackingStatus } from 'selectors/location'
import { updateTrackedLeaderboard } from 'actions/locations'
import styles from './styles'


class Tracking extends Component {
  static propTypes = {
    checkIn: PropTypes.func.isRequired,
    locationTrackingStatus: PropTypes.string,
  }

  static defaultProps = {
    locationTrackingStatus: null,
  }

  onSuccess = (url) => {
    this.props.checkIn(url)
  }

  onTrackingPress = () => {
    LocationService.start()
    updateTrackedLeaderboard()
  }

  render() {
    const isRunning = this.props.locationTrackingStatus === LocationTrackingStatus.RUNNING
    return (
      <GradientContainer style={[container.main, styles.container]}>
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
  regatta: props?.navigation?.state?.params,
})

export default connect(mapStateToProps, { checkIn })(Tracking)
