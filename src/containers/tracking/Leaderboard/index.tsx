import { find, get, sortBy } from 'lodash'
import React from 'react'
import { FlatList, Picker, TouchableHighlight, View } from 'react-native'
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

enum ColumnValueType {
  GapToLeader = 'text_leaderboard_column_gap',
  RegattaRank = 'text_leaderboard_column_regattaRank',
  Speed = 'text_leaderboard_column_speed',
  AverageSpeed = 'text_leaderboard_column_averageSpeed',
  DistanceTravelled = 'text_leaderboard_column_distanceTravelled',
  NumberOfManeuvers = 'text_leaderboard_column_maneuvers',
}

const Seperator = () => {
  return (
    <View style={[container.largeHorizontalMargin]}>
      <LineSeparator style={[styles.separator]} />
    </View>
  )
}

const ColumnValue = ({selectedColumn, competitorData}: any) => {
  if (selectedColumn === ColumnValueType.GapToLeader) {
    const {gapToLeader, gain} = competitorData
    return (
      <Gap gap={gapToLeader} gain={gain} />
    )
  }

  let value

  switch (selectedColumn) {
    case ColumnValueType.RegattaRank:
      value = competitorData.regattaRank
      break
    case ColumnValueType.Speed:
      value = competitorData.speed
      break
    case ColumnValueType.AverageSpeed:
      value = competitorData.averageSpeed
      break
    case ColumnValueType.DistanceTravelled:
      const distanceTravelled = competitorData.distanceTravelled
      value = distanceTravelled !== undefined ? Math.floor(distanceTravelled) : undefined
      break
    case ColumnValueType.NumberOfManeuvers:
      value = competitorData.numberOfManeuvers
      break
    default:
      value = undefined
      break
  }

  return (
    <View style={[styles.textContainer]}>
      <Text style={[styles.gapText]}>{value || EMPTY_VALUE}</Text>
    </View>
  )

}

const Gap = ({ gap, gain, fontSize }: any) => {
  const negative = gap < 0
  const negativeText = negative ? '-' : ''

  let gapText

  if (gap === undefined) {
    gapText = EMPTY_VALUE
  } else {
    const gapAbs = Math.abs(gap)
    const minutes = Math.floor(gapAbs / 60)
    const seconds = gapAbs % 60
    gapText =
      minutes !== 0
        ? `${negativeText}${minutes}m ${seconds}s`
        : `${negativeText}${seconds}s`
  }

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
    selectedColumn: ColumnValueType.GapToLeader,
  }

  public render() {
    const { trackedLeaderboardData, leaderboardData } = this.props
    const { selectedCompetitor, selectedColumn } = this.state

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
              {/*
              <Text
                style={[styles.title]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {gapTitle.toUpperCase()}
              </Text>
              */}
              <Picker
                itemStyle={[styles.title]}
                style={{width: 200}}
                selectedValue={selectedColumn}
                onValueChange={(itemValue: any) =>
                  this.setState({selectedColumn: itemValue})
                }
              >
                {Object.keys(ColumnValueType).map(k =>
                  <Picker.Item key={k} label={I18n.t(ColumnValueType[k])} value={ColumnValueType[k]}/>
                )}
              </Picker>
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
    const regattaRank = competitorData.overallRank
    const country = competitorData.countryCode

    const currentTrackData: any =
      currentTrackName &&
      get(competitorData, ['columns', currentTrackName])

    const rank: number | undefined =
      currentTrackData &&
      get(currentTrackData, 'trackedRank')
    const fleet: string | undefined =
      currentTrackData &&
      get(currentTrackData, 'fleet')

    let gapToLeader: number | undefined =
      currentTrackData &&
      get(currentTrackData, ['data', 'gapToLeader-s'])

    const speed: number | undefined =
      currentTrackData &&
      get(currentTrackData, ['data', 'currentSpeedOverGround-kts'])

    const averageSpeed: number | undefined =
      currentTrackData &&
      get(currentTrackData, ['data', 'averageSpeedOverGround-kts'])

    const distanceTravelled: number | undefined =
      currentTrackData &&
      get(currentTrackData, ['data', 'distanceTraveled-m'])

    const numberOfManeuvers: number | undefined =
      currentTrackData &&
      get(currentTrackData, ['data', 'numberOfManeuvers'])

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
      id,
      speed,
      averageSpeed,
      distanceTravelled,
      numberOfManeuvers,
    }
  }

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

    if (competitorGapToLeader === undefined || myGapToLeader === undefined) {
      return undefined
    }

    return Math.ceil(myGapToLeader - competitorGapToLeader)

  }

  private onLeaderboardItemPress = (competitorId?: string) => () => {
    this.setState({ selectedCompetitor: competitorId })
  }

  private renderItem = ({ item }: any) => {
    const { name, rank, country, id } = item
    const { selectedColumn } = this.state
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
              <ColumnValue selectedColumn={selectedColumn} competitorData={item} />
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
