import _ from 'lodash'
import React from 'react'
import { FlatList, View } from 'react-native'
import { connect } from 'react-redux'

import I18n from 'i18n'
import { getTrackedCheckIn } from 'selectors/checkIn'
import {
  getTrackedCompetitorLeaderboardData,
  getTrackedLeaderboard,
} from 'selectors/leaderboard'

import ConnectivityIndicator from 'components/ConnectivityIndicator'
import LineSeparator from 'components/LineSeparator'
import Text from 'components/Text'
import TrackingProperty from 'components/TrackingProperty'

import { CheckIn } from 'models'
import { container } from 'styles/commons'
import styles from './styles'

const EMPTY_VALUE = '-'

const Seperator = () => {
  return (
    <View style={[container.largeHorizontalMargin]}>
      <LineSeparator style={[styles.separator]} />
    </View>
  )
}

class Leaderboard extends React.Component<{
  trackedLeaderboardData: any
  leaderboardData: any
  checkInData: CheckIn
}> {
  public render() {
    const { trackedLeaderboardData, leaderboardData } = this.props

    const competitorsHardcoded = [
      { name: 'foo', rank: 2 },
      { name: 'bar', rank: 3 },
      { name: 'bem', rank: 5 },
      { name: 'for', rank: 6 },
      { name: 'baz', rank: 1 },
      { name: 'buz', rank: 4 },
    ]

    const competitorData = this.mapLeaderboardToCompetitorData(leaderboardData)
    const leaderboard = _.sortBy(competitorData, ['rank'])

    const trackedLeaderboard = this.extractCompetitorData(
      trackedLeaderboardData,
    )

    return (
      <View style={[container.main]}>
        <ConnectivityIndicator style={styles.connectivity} />
        <View style={[container.mediumHorizontalMargin, styles.container]}>
          <View style={styles.propertyRow}>
            <View>
              <TrackingProperty
                title={I18n.t('text_tracking_rank')}
                value={trackedLeaderboard.rank || EMPTY_VALUE}
              />
            </View>
            <View style={[styles.rightPropertyContainer]}>
              <TrackingProperty
                title={'Calculated time at fastest'}
                value={
                  trackedLeaderboard.calculatedTimeAtFastest || EMPTY_VALUE
                }
              />
            </View>
          </View>
        </View>
        <View style={[styles.listContainer]}>
          <LineSeparator style={{ backgroundColor: '#123456', height: 2 }} />
          <FlatList data={leaderboard} renderItem={this.renderItem} />
        </View>
      </View>
    )
  }

  private extractCompetitorData = (competitorData: any) => {
    const { checkInData } = this.props
    const currentTrackName = checkInData && checkInData.currentTrackName
    const name = _.get(competitorData, 'name')
    const rank =
      currentTrackName &&
      _.get(competitorData, ['columns', currentTrackName, 'rank'])
    const regattaRank = _.get(competitorData, 'overallRank')
    // The handicap value
    // Currently gets gapToLeader. TODO: get the actual calculatedTimeAtFastest
    const calculatedTimeAtFastest =
      currentTrackName &&
      _.get(competitorData, [
        'columns',
        currentTrackName,
        'data',
        'gapToLeader-s',
      ])

    return {
      name,
      rank,
      regattaRank,
      calculatedTimeAtFastest,
    }
  }

  // TODO: This should be memoized
  private mapLeaderboardToCompetitorData = (leaderboardData: any) => {
    const competitors = _.get(leaderboardData, 'competitors')
    return competitors.map(this.extractCompetitorData)
  }

  private renderItem = ({ item }: any) => {
    const { name, rank, regattaRank, calculatedTimeAtFastest } = item
    return (
      <View style={[styles.listRowContainer]}>
        <View
          style={[container.mediumHorizontalMargin, styles.listItemContainer]}
        >
          <Text style={[styles.nameText]}>{name || EMPTY_VALUE}</Text>
          <Text style={[styles.rankText]}>{rank || EMPTY_VALUE}</Text>
        </View>
        <Seperator />
      </View>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    checkInData: getTrackedCheckIn(state) || {},
    trackedLeaderboardData: getTrackedCompetitorLeaderboardData(state) || {},
    leaderboardData: getTrackedLeaderboard(state) || {},
  }
}

export default connect(mapStateToProps)(Leaderboard)
