import React from 'react'
import { connect } from 'react-redux'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';

import {
  startPollingLeaderboard,
  stopPollingLeaderboard,
} from 'actions/leaderboards'

class LeaderboardFetcher extends React.Component<{
  rankOnly: boolean
}> {
  public state = { interval: null }

  public render() {
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
          return () => {
            this.onBlur();
          };
        }, [this.onBlur]) // Add any dependencies if needed
    );

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        this.onFocus();
      });

      return unsubscribe;
    }, [navigation]);

    return (
      <></ >
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
