import { difference, find, get, sortBy } from 'lodash'
import React from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  View,
  Platform,
} from 'react-native'
import ModalDropdown from 'components/ModalDropdown'
import { connect } from 'react-redux'

import I18n from 'i18n'
import { getTrackedCheckInCompetitorId } from 'selectors/checkIn'
import { getTrackedLeaderboard, isLeaderboardStale } from 'selectors/leaderboard'

import ConnectivityIndicator from 'components/ConnectivityIndicator'
import Text from 'components/Text'
import CompetitorList from './CompetitorList'
import LeaderboardFetcher from './LeaderboardFetcher'
import MyColumnValue from './MyColumnValue'
import { getWindowWidth } from 'helpers/screen'
import { ColumnValueType, EMPTY_VALUE } from './constants'

import { LeaderboardCompetitorCurrentTrack } from 'models'
import { getTrackedRegattaRankingMetric } from 'selectors/regatta'
import { $smallSpacing } from 'styles/dimensions'
import Images from '../../../../assets/Images'
import styles, { topRowValueFontSize } from './styles'

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
      isLeaderboardStale
    } = this.props
    const leaderboard = sortBy(
      this.props.leaderboard,
      (o: LeaderboardCompetitorCurrentTrack) =>
        o.trackedColumn ? o.trackedColumn.rank : o.rank,
    )

    const {
      chooseMetricModalShowing,
      selectedCompetitor,
      selectedColumn,
    } = this.state

    const myCompetitorData = this.getCompetitorById(myCompetitorId)

    const rank = get(myCompetitorData, ['trackedColumn', 'rank'])

    const comparedCompetitorData = selectedCompetitor
      ? this.getCompetitorById(selectedCompetitor)
      : ({} as LeaderboardCompetitorCurrentTrack)

    const columnText =
      selectedColumn === ColumnValueType.GapToCompetitor
        ? `${I18n.t(selectedColumn)} ${comparedCompetitorData.name}`
        : selectedColumn && I18n.t(selectedColumn)

    return (
      <View style={styles.mainContainer}>
        <LeaderboardFetcher rankOnly={false} />
        <ConnectivityIndicator style={styles.connectivity} />
        <Text style={styles.header}>{'Leaderboard'.toUpperCase()}</Text>
        <View style={styles.container}>
          <View style={styles.propertyRow}>
            <View style={styles.leftPropertyContainer}>
              <View style={[styles.textContainer, styles.topRowItemContainer]}>
                <Text style={[styles.gapText]}>
                  {(rank && String(rank)) || EMPTY_VALUE}
                </Text>
              </View>
              <Text style={styles.rankTitle}>
                {I18n.t('text_leaderboard_my_rank')}
              </Text>
            </View>
            <View style={[styles.rightPropertyContainer]}>
              <View style={[styles.textContainer, styles.topRowItemContainer]}>
                <MyColumnValue
                  selectedColumn={selectedColumn}
                  competitorData={myCompetitorData}
                  comparedCompetitorData={comparedCompetitorData}
                  fontSize={topRowValueFontSize}
                  rankingMetric={rankingMetric}
                />
              </View>
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
        {
          isLeaderboardStale ? (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            <View style={[styles.listContainer]}>
              <CompetitorList
                leaderboard={leaderboard}
                forLeaderboard={true}
                onCompetitorItemPress={this.onLeaderboardItemPress}
                rankingMetric={rankingMetric}
                myCompetitorData={myCompetitorData}
                selectedColumn={selectedColumn}
              />
            </View>
          )
        }
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
    propertyStyle.width = getWindowWidth() - 2 * $smallSpacing
    propertyStyle.height = 235
    propertyStyle.marginTop = Platform.OS === 'ios' ? 10 : -10
    return propertyStyle
  }

  private renderDropdownRow = (option: any) => (
    <Text style={[styles.dropdownRowText]}>{I18n.t(option)}</Text>
  )

  private onDropdownSelect = (index: any, value: any) => {
    this.setState({ selectedColumn: value })
  }
}

const mapStateToProps = (state: any) => {
  return {
    trackedCheckInCompetitorId: getTrackedCheckInCompetitorId(state),
    leaderboard: getTrackedLeaderboard(state) || [],
    rankingMetric: getTrackedRegattaRankingMetric(state),
    isLeaderboardStale: isLeaderboardStale(state),
  }
}

export default connect(mapStateToProps)(Leaderboard)
