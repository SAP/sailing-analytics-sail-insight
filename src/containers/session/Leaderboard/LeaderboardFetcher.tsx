import React from 'react'
import { connect } from 'react-redux'
import { NavigationEvents } from '@react-navigation/compat'

import {
  startPeriodicLeaderboardUpdates,
  stopPeriodicLeaderboardUpdates,
} from 'actions/leaderboards'

class LeaderboardFetcher extends React.Component<{
  rankOnly: boolean
}> {
  public state = { interval: null }

  public render() {
    return (
      <NavigationEvents onWillFocus={this.onFocus} onWillBlur={this.onBlur} />
    )
  }

  protected onFocus = () => {
    this.setState({
      interval: this.props.startPeriodicLeaderboardUpdates(this.props.rankOnly)
    })
  }
  protected onBlur = () => {
    this.props.stopPeriodicLeaderboardUpdates(this.state.interval)
    this.setState({ interval: null })
  }
}

export default connect(
  () => ({}),
  { startPeriodicLeaderboardUpdates, stopPeriodicLeaderboardUpdates },
)(LeaderboardFetcher)
