import { get, sortBy } from 'lodash'
import React from 'react'
import { FlatList, View } from 'react-native'
import Flag from 'react-native-flags'
import { connect } from 'react-redux'

import I18n from 'i18n'
import { getTrackedCheckIn } from 'selectors/checkIn'
import {
  getLeaderboardGaps,
  getTrackedCompetitorLeaderboardData,
  getTrackedLeaderboard,
} from 'selectors/leaderboard'

import ConnectivityIndicator from 'components/ConnectivityIndicator'
import LineSeparator from 'components/LineSeparator'
import Text from 'components/Text'
import TrackingProperty from 'components/TrackingProperty'

import {
  CheckIn,
  Leaderboard as ILeaderboard,
  LeaderboardCompetitor,
} from 'models'
import { CompetitorGapMap } from 'reducers/config'
import { container } from 'styles/commons'
import styles from './styles'

const EMPTY_VALUE = '-'

const TRIANGLE_UP = '▲'
const TRIANGLE_DOWN = '▼'

const Seperator = () => {
  return (
    <View style={[container.largeHorizontalMargin]}>
      <LineSeparator style={[styles.separator]} />
    </View>
  )
}
const Gap = ({ gap, gain }: any) => {
  const minutes = gap && Math.floor(gap / 60)
  const seconds = gap && gap % 60
  const gapText = gap === undefined ? EMPTY_VALUE :
                  minutes !== 0 ? `${minutes}m ${seconds}s` :
                  `${seconds}s`

  return (
    <View style={[styles.textContainer]}>
      <Text style={[styles.gapText]}>
        {gapText}
      </Text>
      <Text
        style={[styles.triangle, gain === true ? styles.green : styles.red]}
      >
        {gain === undefined ? ' ' : gain === true ? TRIANGLE_UP : TRIANGLE_DOWN}
      </Text>
    </View>
  )
}

class Leaderboard extends React.Component<{
  trackedLeaderboardData: LeaderboardCompetitor
  leaderboardData: ILeaderboard
  checkInData: CheckIn
  leaderboardGaps: CompetitorGapMap,
}> {
  public render() {
    const { trackedLeaderboardData, leaderboardData } = this.props

    const competitorData = this.mapLeaderboardToCompetitorData(leaderboardData)
    const leaderboard = sortBy(competitorData, ['rank'])

    const { rank, gapToLeader, gain } = this.extractCompetitorData(
      trackedLeaderboardData,
    )

    return (
      <View style={[container.main]}>
        <ConnectivityIndicator style={styles.connectivity} />
        <View style={[container.mediumHorizontalMargin, styles.container]}>
          <View style={styles.propertyRow}>
            <View>
              <TrackingProperty
                title={I18n.t('text_leaderboard_my_rank')}
                value={(rank && String(rank)) || EMPTY_VALUE}
              />
            </View>
            <View style={[styles.rightPropertyContainer]}>
              <Text
                style={[styles.title]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {I18n.t('text_leaderboard_my_gap').toUpperCase()}
              </Text>
              <Gap gap={gapToLeader} gain={gain} />
            </View>
          </View>
        </View>
        <View style={[styles.listContainer]}>
          <LineSeparator style={{ backgroundColor: '#000000', height: 2 }} />
          <FlatList data={leaderboard} renderItem={this.renderItem} />
        </View>
      </View>
    )
  }

  private extractCompetitorData = (competitorData: LeaderboardCompetitor) => {
    const { checkInData, leaderboardGaps } = this.props
    const currentTrackName = checkInData && checkInData.currentTrackName
    const name = competitorData.name
    const rank: number | undefined =
      currentTrackName &&
      get(competitorData, ['columns', currentTrackName, 'trackedRank'])
    const regattaRank = competitorData.overallRank
    const country = competitorData.countryCode
    const fleet: string | undefined =
      currentTrackName &&
      get(competitorData, ['columns', currentTrackName, 'fleet'])

    // The handicap value
    // TODO: Maybe this will have to be calculatedTimeAtFastest
    let gapToLeader: number | undefined =
      currentTrackName &&
      get(competitorData, [
        'columns',
        currentTrackName,
        'data',
        'gapToLeader-s',
      ])

    if (gapToLeader !== undefined) {
      gapToLeader = Math.ceil(gapToLeader)
    }

    const gain: boolean | undefined =
      competitorData.id &&
      get(leaderboardGaps, [competitorData.id, 'gaining'])

    return {
      name,
      rank,
      regattaRank,
      gapToLeader,
      fleet,
      country,
      gain,
    }
  }

  // TODO: This should be memoized
  private mapLeaderboardToCompetitorData = (leaderboardData: ILeaderboard) => {
    const { checkInData } = this.props
    const currentFleet = checkInData && checkInData.currentFleet

    const competitors = leaderboardData.competitors
    return (
      competitors &&
      competitors
        .map(this.extractCompetitorData)
        .filter((datum: any) => datum.fleet === currentFleet)
    )
  }

  private renderItem = ({ item }: any) => {
    const {
      name,
      rank,
      regattaRank,
      country,
      gapToLeader,
      gain,
    } = item
    return (
      <View style={[styles.listRowContainer]}>
        <View
          style={[container.smallHorizontalMargin, styles.listItemContainer]}
        >
          <View style={[styles.textContainer]}>
            <Text style={[styles.rankText]}>{rank || EMPTY_VALUE}</Text>
            <Flag style={[styles.flag]} code={country} size={24} />
            <Text style={[styles.nameText]}>{name || EMPTY_VALUE}</Text>
          </View>
          <Gap gap={gapToLeader} gain={gain} />
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
    leaderboardGaps:
      getLeaderboardGaps(state) || ({} as CompetitorGapMap),
  }
}

export default connect(mapStateToProps)(Leaderboard)
