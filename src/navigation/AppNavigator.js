import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { initExistingCheckIn } from 'actions/checkIn'

import NavigationService from './NavigationService'
import MainNavigator from './navigators/MainNavigator'


class AppNavigator extends Component {
  static propTypes = {
    initExistingCheckIn: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.initExistingCheckIn()
  }

  render() {
    return (
      <MainNavigator
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef)
        }}
      />
    )
  }
}

export default connect(null, { initExistingCheckIn })(AppNavigator)
