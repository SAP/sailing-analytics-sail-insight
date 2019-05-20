import { find, get, sortBy } from 'lodash'
import React from 'react'
import { FlatList, Picker, TouchableHighlight, View } from 'react-native'
import Flag from 'react-native-flags'
import { connect } from 'react-redux'

import I18n from 'i18n'
import { getTrackedCheckIn } from 'selectors/checkIn'
import {
  getLeaderboardGaps,
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
  GapToCompetitor = 'text_leaderboard_column_gap_competitor',
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

const MyColumnValue = ({
  selectedColumn,
  competitorData,
  fontSize,
  comparedCompetitorData,
}: any) => {

  if (selectedColumn === ColumnValueType.GapToCompetitor) {
    const { gapToLeader: myGapToLeader } = competitorData
    const { gapToLeader: comparedGapToLeader } = comparedCompetitorData

    const gapToCompetitor =
      comparedGapToLeader === undefined || myGapToLeader === undefined
        ? undefined
        : Math.ceil(myGapToLeader - comparedGapToLeader)

    const modifiedCompetitorData = {
      ...competitorData,
      gain: undefined,
      gapToLeader: gapToCompetitor,
    }

    return (
      <ColumnValue
        selectedColumn={selectedColumn}
        competitorData={modifiedCompetitorData}
        fontSize={fontSize}
      />
    )
  }

  return (
    <ColumnValue
      selectedColumn={selectedColumn}
      competitorData={competitorData}
      fontSize={fontSize}
    />
  )
}

const ColumnValue = ({ selectedColumn, competitorData, fontSize }: any) => {
  if (
    selectedColumn === ColumnValueType.GapToLeader ||
    selectedColumn === ColumnValueType.GapToCompetitor
  ) {
    const { gapToLeader, gain } = competitorData
    return <Gap gap={gapToLeader} gain={gain} fontSize={fontSize} />
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
      value =
        distanceTravelled !== undefined
          ? Math.floor(distanceTravelled)
          : undefined
      break
    case ColumnValueType.NumberOfManeuvers:
      value = competitorData.numberOfManeuvers
      break
    default:
      value = undefined
      break
  }

  const fontSizeOverride = fontSize === undefined ? {} : { fontSize }

  return (
    <View style={[styles.textContainer]}>
      <Text style={[styles.gapText, fontSizeOverride]}>
        {value || EMPTY_VALUE}
      </Text>
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

  const fontSizeOverride = fontSize === undefined ? {} : { fontSize }
  const emptySpaceOverride = fontSize === undefined ? {} : { width: fontSize }

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
  leaderboardData: ILeaderboard
  checkInData: CheckIn
  leaderboardGaps: CompetitorGapMap
}> {
  public state = {
    selectedCompetitor: undefined,
    selectedColumn: ColumnValueType.GapToLeader,
  }

  public render() {
    const { leaderboardData, checkInData } = this.props
    const { selectedCompetitor, selectedColumn } = this.state

    const competitorData = this.mapLeaderboardToCompetitorData(leaderboardData)
    const leaderboard = sortBy(competitorData, ['rank'])

    const myCompetitorId = checkInData && checkInData.competitorId
    const myCompetitorData = this.getCompetitorById(leaderboard, myCompetitorId)

    const { rank } = myCompetitorData

    const comparedCompetitorData = selectedCompetitor
      ? this.getCompetitorById(leaderboard, selectedCompetitor)
      : ({} as any)

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
              <Picker
                itemStyle={[styles.title]}
                style={[styles.picker]}
                mode="dropdown"
                selectedValue={selectedColumn}
                onValueChange={this.onColumnPickerValueChange}
              >
                {Object.keys(ColumnValueType).map((k: any) => (
                  <Picker.Item
                    key={k}
                    label={I18n.t(ColumnValueType[k]).toUpperCase()}
                    value={ColumnValueType[k]}
                  />
                ))}
              </Picker>
              <MyColumnValue
                selectedColumn={selectedColumn}
                competitorData={myCompetitorData}
                comparedCompetitorData={comparedCompetitorData}
                fontSize={32}
              />
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
      currentTrackName && get(competitorData, ['columns', currentTrackName])

    const rank: number | undefined =
      currentTrackData && get(currentTrackData, 'trackedRank')
    const fleet: string | undefined =
      currentTrackData && get(currentTrackData, 'fleet')

    let gapToLeader: number | undefined =
      currentTrackData && get(currentTrackData, ['data', 'gapToLeader-s'])

    const speed: number | undefined =
      currentTrackData &&
      get(currentTrackData, ['data', 'currentSpeedOverGround-kts'])

    const averageSpeed: number | undefined =
      currentTrackData &&
      get(currentTrackData, ['data', 'averageSpeedOverGround-kts'])

    const distanceTravelled: number | undefined =
      currentTrackData && get(currentTrackData, ['data', 'distanceTraveled-m'])

    const numberOfManeuvers: number | undefined =
      currentTrackData && get(currentTrackData, ['data', 'numberOfManeuvers'])

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

  private getCompetitorById = (leaderboardData: any, competitorId: any) => {
    const competitorData = find(leaderboardData, { id: competitorId })
    return competitorData || ({} as any)
  }

  private onLeaderboardItemPress = (competitorId?: string) => () => {
    this.setState({
      selectedCompetitor: competitorId,
      selectedColumn: ColumnValueType.GapToCompetitor,
    })
  }

  private onColumnPickerValueChange = (itemValue: any) => {
    this.setState({
      selectedColumn: itemValue,
      selectedCompetitor: undefined,
    })
  }

  private renderItem = ({ item }: any) => {
    const { name, rank, country, id } = item
    const { selectedColumn } = this.state
    return (
      <>
        <TouchableHighlight onPress={this.onLeaderboardItemPress(id)}>
          <View style={[styles.listRowContainer]}>
            <View
              style={[
                container.smallHorizontalMargin,
                styles.listItemContainer,
              ]}
            >
              <View style={[styles.textContainer]}>
                <Text style={[styles.rankText]}>{rank || EMPTY_VALUE}</Text>
                <Flag style={[styles.flag]} code={country} size={24} />
                <Text style={[styles.nameText]}>{name || EMPTY_VALUE}</Text>
              </View>
              <ColumnValue
                selectedColumn={selectedColumn}
                competitorData={item}
              />
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
    leaderboardData: getTrackedLeaderboard(state) || {},
    leaderboardGaps: getLeaderboardGaps(state) || ({} as CompetitorGapMap),
  }
}

export default connect(mapStateToProps)(Leaderboard)
