import { difference, find, get, sortBy } from 'lodash'
import React from 'react'
import {
  FlatList,
  ListRenderItemInfo,
  TouchableHighlight,
  View,
} from 'react-native'
import Flag from 'react-native-flags'
import ModalDropdown from 'react-native-modal-dropdown'
import { connect } from 'react-redux'

import I18n from 'i18n'
import { getTrackedCheckInCompetitorId } from 'selectors/checkIn'
import { getTrackedLeaderboard } from 'selectors/leaderboard'

import ConnectivityIndicator from 'components/ConnectivityIndicator'
import LineSeparator from 'components/LineSeparator'
import Text from 'components/Text'
import TrackingProperty from 'components/TrackingProperty'

import { LeaderboardCompetitorCurrentTrack } from 'models'
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

interface MyColumnValueProps extends ColumnValueProps {
  comparedCompetitorData?: LeaderboardCompetitorCurrentTrack
}

const MyColumnValue = ({
  selectedColumn,
  competitorData,
  fontSize,
  comparedCompetitorData,
}: MyColumnValueProps) => {

  if (selectedColumn === ColumnValueType.GapToCompetitor) {
    const myGapToLeader =
      competitorData.trackedColumnData &&
      competitorData.trackedColumnData.gapToLeaderInS
    const comparedGapToLeader =
      comparedCompetitorData &&
      comparedCompetitorData.trackedColumnData &&
      comparedCompetitorData.trackedColumnData.gapToLeaderInS

    const gapToCompetitor =
      comparedGapToLeader === undefined || myGapToLeader === undefined
        ? undefined
        : myGapToLeader - comparedGapToLeader

    const modifiedCompetitorData: LeaderboardCompetitorCurrentTrack = {
      ...competitorData,
      gain: undefined,
      trackedColumnData: {
        ...competitorData.trackedColumnData,
        gapToLeaderInS: gapToCompetitor,
      },
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

interface ColumnValueProps {
  selectedColumn?: ColumnValueType
  competitorData: LeaderboardCompetitorCurrentTrack
  fontSize?: number
}

const ColumnValue = ({
  selectedColumn,
  competitorData,
  fontSize,
}: ColumnValueProps) => {
  if (
    selectedColumn === ColumnValueType.GapToLeader ||
    selectedColumn === ColumnValueType.GapToCompetitor
  ) {
    const { gain } = competitorData
    const gapToLeader =
      competitorData.trackedColumnData &&
      competitorData.trackedColumnData.gapToLeaderInS

    return <Gap gap={gapToLeader} gain={gain} fontSize={fontSize} />
  }

  let value

  switch (selectedColumn) {
    case ColumnValueType.RegattaRank:
      value = competitorData.overallRank
      break
    case ColumnValueType.Speed:
      value =
        competitorData.trackedColumnData &&
        competitorData.trackedColumnData.currentSpeedOverGround
      break
    case ColumnValueType.AverageSpeed:
      value =
        competitorData.trackedColumnData &&
        competitorData.trackedColumnData.averageSpeedOverGround
      break
    case ColumnValueType.DistanceTravelled:
      const distanceTravelled =
        competitorData.trackedColumnData &&
        competitorData.trackedColumnData.distanceTravelled
      value =
        distanceTravelled !== undefined
          ? Math.floor(distanceTravelled)
          : undefined
      break
    case ColumnValueType.NumberOfManeuvers:
      value =
        competitorData.trackedColumnData &&
        competitorData.trackedColumnData.numberOfManeuvers
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
    const gapRounded = Math.ceil(gap)
    const gapAbs = Math.abs(gapRounded)
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
  trackedCheckInCompetitorId: string | undefined
  leaderboard: LeaderboardCompetitorCurrentTrack[]
}> {
  public state = {
    selectedCompetitor: undefined,
    selectedColumn: ColumnValueType.GapToLeader,
  }

  public render() {
    const { trackedCheckInCompetitorId: myCompetitorId } = this.props
    const leaderboard = sortBy(
      this.props.leaderboard,
      (o: LeaderboardCompetitorCurrentTrack) =>
        o.trackedColumn ? o.trackedColumn.trackedRank : o.rank,
    )

    const { selectedCompetitor, selectedColumn } = this.state

    const myCompetitorData = this.getCompetitorById(myCompetitorId)

    const rank = get(myCompetitorData, ['trackedColumn', 'trackedRank'])

    const comparedCompetitorData = selectedCompetitor
      ? this.getCompetitorById(selectedCompetitor)
      : ({} as LeaderboardCompetitorCurrentTrack)

    const columnText = selectedColumn === ColumnValueType.GapToCompetitor ?
      `${I18n.t(selectedColumn)} ${comparedCompetitorData.name}`.toUpperCase()
      : (selectedColumn && I18n.t(selectedColumn).toUpperCase())

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
              <ModalDropdown
                options={difference(Object.values(ColumnValueType), [ColumnValueType.GapToCompetitor])}
                onSelect={this.onDropdownSelect}
                renderRow={this.renderDropdownRow}
              >
                <Text
                  style={[styles.title]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {`${columnText}${TRIANGLE_DOWN}`}
                </Text>
              </ModalDropdown>
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

  private getCompetitorById = (
    competitorId?: string,
  ): LeaderboardCompetitorCurrentTrack => {
    const { leaderboard } = this.props
    const competitorData = find(leaderboard, { id: competitorId })
    return competitorData || ({} as LeaderboardCompetitorCurrentTrack)
  }

  private onLeaderboardItemPress = (competitorId?: string) => () => {
    this.setState({
      selectedCompetitor: competitorId,
      selectedColumn: ColumnValueType.GapToCompetitor,
    })
  }

  private renderDropdownRow = (option: any, index: any, isSelected: any) => (
    <Text style={{ margin: 10 }}>
      {I18n.t(option).toUpperCase()}
    </Text>
  )

  private onDropdownSelect = (index: any, value: any) => {
    this.setState({ selectedColumn: value })
  }

  private renderItem = ({
    item,
  }: ListRenderItemInfo<LeaderboardCompetitorCurrentTrack>) => {
    const { name, countryCode, id } = item
    const rank = get(item, ['trackedColumn', 'trackedRank'])
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
                <Flag style={[styles.flag]} code={countryCode} size={24} />
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
    trackedCheckInCompetitorId: getTrackedCheckInCompetitorId(state),
    leaderboard: getTrackedLeaderboard(state) || [],
  }
}

export default connect(mapStateToProps)(Leaderboard)
