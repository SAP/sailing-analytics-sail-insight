import { difference, find, get, sortBy } from 'lodash'
import React from 'react'
import {
  Dimensions,
  FlatList,
  Image,
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
import Text from 'components/Text'
import TrackingPropertyReverse from 'components/TrackingPropertyReverse'
import ColumnValue from './ColumnValue'
import MyColumnValue from './MyColumnValue'

import { LeaderboardCompetitorCurrentTrack } from 'models'
import { getTrackedRegattaRankingMetric } from 'selectors/regatta'
import { container } from 'styles/commons'
import { $smallSpacing } from 'styles/dimensions'
import Images from '../../../../assets/Images'
import styles, { normalRowValueFontSize, topRowValueFontSize } from './styles'

export const EMPTY_VALUE = '-'

export enum ColumnValueType {
  GapToLeader = 'text_leaderboard_column_gap',
  GapToCompetitor = 'text_leaderboard_column_gap_competitor',
  GapToMyBoat = 'text_leaderboard_column_gap_my_boat',
  RegattaRank = 'text_leaderboard_column_regattaRank',
  Speed = 'text_leaderboard_column_speed',
  AverageSpeed = 'text_leaderboard_column_averageSpeed',
  DistanceTravelled = 'text_leaderboard_column_distanceTravelled',
  NumberOfManeuvers = 'text_leaderboard_column_maneuvers',
}

const TRIANGLE_UP = () => {
  return (
    <View style={styles.triangleUp}>
      <Image source={Images.actions.arrowUp} style={styles.titleArrow} />
    </View>
  )
}

const TRIANGLE_DOWN = () => {
  return (
    <View style={styles.triangleDown}>
      <Image source={Images.actions.arrowDown} style={styles.titleArrow} />
    </View>
  )
}

class Leaderboard extends React.Component<{
  trackedCheckInCompetitorId: string | undefined
  leaderboard: LeaderboardCompetitorCurrentTrack[]
  rankingMetric: string | undefined
}> {
  public state = {
    selectedCompetitor: undefined,
    selectedColumn: ColumnValueType.GapToLeader,
    chooseMetricModalShowing: false,
  }

  public render() {
    const {
      trackedCheckInCompetitorId: myCompetitorId,
      rankingMetric,
    } = this.props
    const leaderboard = sortBy(
      this.props.leaderboard,
      (o: LeaderboardCompetitorCurrentTrack) =>
        o.trackedColumn ? o.trackedColumn.trackedRank : o.rank,
    )

    const {
      chooseMetricModalShowing,
      selectedCompetitor,
      selectedColumn,
    } = this.state

    const myCompetitorData = this.getCompetitorById(myCompetitorId)

    const rank = get(myCompetitorData, ['trackedColumn', 'trackedRank'])

    const comparedCompetitorData = selectedCompetitor
      ? this.getCompetitorById(selectedCompetitor)
      : ({} as LeaderboardCompetitorCurrentTrack)

    const columnText =
      selectedColumn === ColumnValueType.GapToCompetitor
        ? `${I18n.t(selectedColumn)} ${comparedCompetitorData.name}`
        : selectedColumn && I18n.t(selectedColumn)

    return (
      <View style={styles.mainContainer}>
        <ConnectivityIndicator style={styles.connectivity} />
        <Text style={styles.header}>{'Leaderboard'.toUpperCase()}</Text>
        <View style={styles.container}>
          <View style={styles.propertyRow}>
            <View style={styles.leftPropertyContainer}>
              <View style={[styles.textContainer]}>
                <Text style={[styles.gapText]}>
                  {(rank && String(rank)) || EMPTY_VALUE}
                </Text>
              </View>
              <Text style={styles.rankTitle}>
                {I18n.t('text_leaderboard_my_rank')}
              </Text>
            </View>
            <View style={[styles.rightPropertyContainer]}>
              <MyColumnValue
                selectedColumn={selectedColumn}
                competitorData={myCompetitorData}
                comparedCompetitorData={comparedCompetitorData}
                fontSize={topRowValueFontSize}
                rankingMetric={rankingMetric}
              />
              <ModalDropdown
                options={difference(Object.values(ColumnValueType), [
                  ColumnValueType.GapToCompetitor,
                ])}
                onSelect={this.onDropdownSelect}
                adjustFrame={this.renderAdjustFrame}
                renderRow={this.renderDropdownRow}
                onDropdownWillShow={() =>
                  this.setState({ chooseMetricModalShowing: true })
                }
                onDropdownWillHide={() =>
                  this.setState({ chooseMetricModalShowing: false })
                }
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[styles.title]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {`${columnText} `}
                  </Text>
                  {chooseMetricModalShowing ? (
                    <TRIANGLE_UP />
                  ) : (
                    <TRIANGLE_DOWN />
                  )}
                </View>
              </ModalDropdown>
            </View>
          </View>
        </View>
        <View style={[styles.listContainer]}>
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

  private renderAdjustFrame = (propertyStyle: any) => {
    propertyStyle.left = $smallSpacing
    propertyStyle.width = Dimensions.get('window').width - 2 * $smallSpacing
    propertyStyle.height = 235
    propertyStyle.marginTop = -10
    return propertyStyle
  }

  private renderDropdownRow = (option: any) => (
    <Text style={[styles.dropdownRowText]}>{I18n.t(option)}</Text>
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
    const { rankingMetric } = this.props

    const myCompetitorData = this.getCompetitorById(this.props.trackedCheckInCompetitorId)

    return (
      <TouchableHighlight
        style={[styles.listRowButtonContainer]}
        onPress={this.onLeaderboardItemPress(id)}
      >
        <View style={[styles.listRowContainer]}>
          <View style={[styles.listItemContainer]}>
            <View style={[styles.textContainer, styles.itemTextContainer]}>
              <Text style={[styles.rankTextSmall]}>{rank || EMPTY_VALUE}</Text>
              <Flag
                style={[styles.flag]}
                code={countryCode}
                size={normalRowValueFontSize}
              />
              <Text style={[styles.nameText]}>{name || EMPTY_VALUE}</Text>
            </View>
            <View style={{ flex: 0 }}>
              <ColumnValue
                selectedColumn={selectedColumn}
                competitorData={item}
                myCompetitorData={myCompetitorData}
                rankingMetric={rankingMetric}
                fontSize={normalRowValueFontSize}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    trackedCheckInCompetitorId: getTrackedCheckInCompetitorId(state),
    leaderboard: getTrackedLeaderboard(state) || [],
    rankingMetric: getTrackedRegattaRankingMetric(state),
  }
}

export default connect(mapStateToProps)(Leaderboard)
