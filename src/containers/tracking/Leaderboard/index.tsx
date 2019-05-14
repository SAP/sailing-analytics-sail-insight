import _ from 'lodash'
import React from 'react'
import { FlatList, View } from 'react-native'
import Flag from 'react-native-flags'
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

import { CheckIn, Leaderboard as ILeaderboard, LeaderboardCompetitor } from 'models'
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
  trackedLeaderboardData: LeaderboardCompetitor
  leaderboardData: ILeaderboard
  checkInData: CheckIn,
}> {
  public render() {
    const { trackedLeaderboardData, leaderboardData } = this.props

    const competitorsHardcoded = [
      { name: 'foo', rank: 2, calculatedTimeAtFastest: 10 },
      { name: 'bar', rank: 3 , calculatedTimeAtFastest: 11 },
      { name: 'bem', rank: 5 , calculatedTimeAtFastest: 34 },
      { name: 'thud', rank: 8, calculatedTimeAtFastest: 137 },
      { name: 'for', rank: 6, calculatedTimeAtFastest: 54 },
      { name: 'quz', rank: 1, calculatedTimeAtFastest: '0' },
      { name: 'fred', rank: 7, calculatedTimeAtFastest: 86 },
      { name: 'quuz', rank: 4, calculatedTimeAtFastest: 23 },
    ]

    const competitorData = this.mapLeaderboardToCompetitorData(leaderboardData)
    const leaderboard = _.sortBy(competitorsHardcoded, ['rank'])

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
                value={String(trackedLeaderboard.regattaRank) || EMPTY_VALUE}
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

  private extractCompetitorData = (competitorData: LeaderboardCompetitor) => {
    const { checkInData } = this.props
    const currentTrackName = checkInData && checkInData.currentTrackName
    const name = competitorData.name
    const rank =
      currentTrackName &&
      _.get(competitorData, ['columns', currentTrackName, 'rank'])
    const regattaRank = competitorData.overallRank
    const country = competitorData.countryCode
    const fleet =
      currentTrackName &&
      _.get(competitorData, ['columns', currentTrackName, 'fleet'])

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
      fleet,
      country,
    }
  }

  // TODO: This should be memoized
  private mapLeaderboardToCompetitorData = (leaderboardData: ILeaderboard) => {
    const { checkInData } = this.props
    const currentFleet = checkInData && checkInData.currentFleet

    const competitors = leaderboardData.competitors
    return competitors && competitors
      .map(this.extractCompetitorData)
      .filter((datum: any) => datum.fleet === currentFleet)
  }

  private renderItem = ({ item }: any) => {
    const { name, rank, regattaRank, country, calculatedTimeAtFastest } = item
    return (
      <View style={[styles.listRowContainer]}>
        <View
          style={[container.smallHorizontalMargin, styles.listItemContainer]}
        >
        <View style={[styles.textContainer]}>
          <Text style={[styles.rankText]}>{rank || EMPTY_VALUE}</Text>
          <Flag
            style={[styles.flag]}
            code={country}
            size={24}
          />
          <Text style={[styles.nameText]}>{name || EMPTY_VALUE}</Text>
        </View>
          <Text style={[styles.gapText]}>{calculatedTimeAtFastest || EMPTY_VALUE}</Text>
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
