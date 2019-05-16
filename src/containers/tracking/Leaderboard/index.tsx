import { find, get, sortBy } from 'lodash'
import React from 'react'
import { FlatList, TouchableHighlight, View } from 'react-native'
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
const Gap = ({ gap, gain, fontSize }: any) => {
  const negative = gap < 0
  const negativeText = negative ? '-' : ''
  gap = Math.abs(gap)
  const minutes = gap && Math.floor(gap / 60)
  const seconds = gap && gap % 60
  const gapText =
    gap === undefined
      ? EMPTY_VALUE
      : minutes !== 0
      ? `${negativeText}${minutes}m ${seconds}s`
      : `${negativeText}${seconds}s`

  const fontSizeOverride =
    fontSize === undefined
      ? {}
      : {
        fontSize,
      }

  const emptySpaceOverride =
    fontSize === undefined
      ? {}
      : {
        width: fontSize,
      }

  return (
    <View style={[styles.textContainer]}>
      <Text style={[styles.gapText, fontSizeOverride]}>{gapText}</Text>
      {/* This is so that numbers wihtout the indicators are aligned
          with numbers which have indicators */}
      {gain === undefined && (
        <View style={[styles.triangleEmptySpace, emptySpaceOverride]} />
      )}
      <Text
        style={[
          styles.triangle,
          fontSizeOverride,
          gain === true ? styles.green : styles.red,
        ]}
      >
        {gain === undefined ? '' : gain === true ? TRIANGLE_UP : TRIANGLE_DOWN}
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

  public state = {
    selectedCompetitor: undefined,
  }

  public render() {
    const { trackedLeaderboardData, leaderboardData } = this.props
    const { selectedCompetitor } = this.state

    const competitorData = this.mapLeaderboardToCompetitorData(leaderboardData)
    const leaderboard = sortBy(competitorData, ['rank'])

    const { rank, gapToLeader: myGapToLeader, gain } = this.extractCompetitorData(
      trackedLeaderboardData,
    )

    const gapTitle = selectedCompetitor
      ? 'Gap to competitor'
      : I18n.t('text_leaderboard_my_gap')

    const gap = selectedCompetitor
      ? this.getGapToCompetitor(myGapToLeader, selectedCompetitor)
      : myGapToLeader

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
                {gapTitle.toUpperCase()}
              </Text>
              <Gap gap={gap} gain={gain} fontSize={32}/>
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
    const id = competitorData.id
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
      id && get(leaderboardGaps, [id, 'gaining'])

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

  private getGapToCompetitor = (myGapToLeader: any, competitorId: any) => {
    const { checkInData, leaderboardData } = this.props
    const currentTrackName = checkInData && checkInData.currentTrackName
    const competitor = find(leaderboardData.competitors, { id: competitorId })
    const competitorGapToLeader =
      currentTrackName &&
      get(competitor, [
        'columns',
        currentTrackName,
        'data',
        'gapToLeader-s',
      ])

    return Math.ceil(myGapToLeader - competitorGapToLeader)
  }

  private onLeaderboardItemPress = (competitorId?: string) => () => {
    this.setState({ selectedCompetitor: competitorId })
  }

  private renderItem = ({ item }: any) => {
    const { name, rank, regattaRank, country, gapToLeader, gain, id } = item
    return (
      <>
        <TouchableHighlight onPress={this.onLeaderboardItemPress(id)} >
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
          </View>
        </TouchableHighlight>
        <Seperator />
      </>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    checkInData: getTrackedCheckIn(state) || {},
    trackedLeaderboardData: getTrackedCompetitorLeaderboardData(state) || {},
    leaderboardData: getTrackedLeaderboard(state) || {},
    leaderboardGaps: getLeaderboardGaps(state) || ({} as CompetitorGapMap),
  }
}

export default connect(mapStateToProps)(Leaderboard)
