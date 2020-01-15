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
import styles from './styles'

export const EMPTY_VALUE = '-'

export enum ColumnValueType {
  GapToLeader = 'text_leaderboard_column_gap',
  GapToCompetitor = 'text_leaderboard_column_gap_competitor',
  RegattaRank = 'text_leaderboard_column_regattaRank',
  Speed = 'text_leaderboard_column_speed',
  AverageSpeed = 'text_leaderboard_column_averageSpeed',
  DistanceTravelled = 'text_leaderboard_column_distanceTravelled',
  NumberOfManeuvers = 'text_leaderboard_column_maneuvers',
}

const TRIANGLE_UP = () => {
  return (
    <Image source={Images.actions.arrowUp} />
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
  }

  public render() {
    const { trackedCheckInCompetitorId: myCompetitorId, rankingMetric } = this.props
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
        <View style={styles.container}>
          <View style={styles.propertyRow}>
            <View style={styles.leftPropertyContainer}>
              <TrackingPropertyReverse
                titleStyle={styles.rankTitle}
                valueStyle={styles.rankValue}
                title={I18n.t('text_leaderboard_my_rank')}
                value={(rank && String(rank)) || EMPTY_VALUE}
              />
            </View>
            <View style={[styles.rightPropertyContainer]}>
              <MyColumnValue
                selectedColumn={selectedColumn}
                competitorData={myCompetitorData}
                comparedCompetitorData={comparedCompetitorData}
                fontSize={56}
                rankingMetric={rankingMetric}/>
              <ModalDropdown
                options={difference(Object.values(ColumnValueType), [ColumnValueType.GapToCompetitor])}
                onSelect={this.onDropdownSelect}
                adjustFrame={this.renderAdjustFrame}
                renderRow={this.renderDropdownRow}>
                <Text
                  style={[styles.title]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {`${columnText} `}<TRIANGLE_UP />
                </Text>
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
    propertyStyle.width = Dimensions.get('window').width - 2 *  $smallSpacing
    propertyStyle.height = 235
    propertyStyle.marginTop = -10
    return propertyStyle
  }

  private renderDropdownRow = (option: any) => (
    <Text style={[styles.dropdownRowText]}>
      {I18n.t(option)}
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
    const { rankingMetric } = this.props

    return <TouchableHighlight onPress={this.onLeaderboardItemPress(id)}>
      <View style={[styles.listRowContainer]}>
        <View
          style={[
            container.smallHorizontalMargin,
            styles.listItemContainer,
          ]}>
          <View style={[styles.textContainer]}>
            <Text style={[styles.rankTextSmall]}>{rank || EMPTY_VALUE}</Text>
            <Flag style={[styles.flag]} code={countryCode} size={24} />
            <Text style={[styles.nameText]}>{name || EMPTY_VALUE}</Text>
          </View>
          <ColumnValue
            selectedColumn={selectedColumn}
            competitorData={item}
            rankingMetric={rankingMetric}
            fontSize={24}/>
        </View>
      </View>
    </TouchableHighlight>
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
