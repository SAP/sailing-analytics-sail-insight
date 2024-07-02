import React from 'react'
import { connect } from 'react-redux'
import { NavigationEvents } from '@react-navigation/compat'

import {
  startPollingLeaderboard,
  stopPollingLeaderboard,
} from 'actions/leaderboards'

class LeaderboardFetcher extends React.Component<{
  rankOnly: boolean
}> {
  public state = { interval: null }

  public render() {
    return (
      <NavigationEvents onDidFocus={this.onFocus} onWillBlur={this.onBlur} />
    )
  }

  protected onFocus = () => {
    // Leave time for the previous navigation event to do the blur action
    // before setting the new up. Ex: when going from tracking screen to leaderboard screen
    // where both pages have a NavigationEvents instance present.
    setTimeout(() => this.props.startPollingLeaderboard({ rankOnly: this.props.rankOnly }), 1000)
  }
  protected onBlur = () => {
    this.props.stopPollingLeaderboard()
  }
}

export default connect(
  () => ({}),
  { startPollingLeaderboard, stopPollingLeaderboard },
)(LeaderboardFetcher)
