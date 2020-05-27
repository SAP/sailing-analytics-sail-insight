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
    // console.log(
    //   `Start leaderboard fetching for ${
    //     this.props.rankOnly ? 'tracking' : 'leaderboard'
    //   }`,
    // )
    this.setState({
      interval: this.props.startPeriodicLeaderboardUpdates(this.props.rankOnly)
    })
  }
  protected onBlur = () => {
    // console.log(
    //   `Stop leaderboard fetching for ${
    //     this.props.rankOnly ? 'tracking' : 'leaderboard'
    //   }`,
    // )
    stopPeriodicLeaderboardUpdates(this.state.interval)
    this.setState({ interval: null })
  }
}

export default connect(
  () => ({}),
  { startPeriodicLeaderboardUpdates },
)(LeaderboardFetcher)
