import { get } from 'lodash'
import React from 'react'
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import Flag from 'react-native-flags'

import { LeaderboardCompetitorCurrentTrack } from 'models'
import ColumnValue from './ColumnValue'
import { ColumnValueType, EMPTY_VALUE } from './Leaderboard'
import styles, { normalRowValueFontSize } from './styles'

class CompetitorList extends React.Component<{
  leaderboard: LeaderboardCompetitorCurrentTrack[]
  onCompetitorItemPress?: any
  rankingMetric?: string
  myCompetitorData?: LeaderboardCompetitorCurrentTrack
  selectedColumn?: ColumnValueType
}> {
  public render() {
    return (
      <FlatList
        data={this.props.leaderboard}
        contentContainerStyle={[styles.listContentContainer]}
        renderItem={this.renderItem}
      />
    )
  }

  private renderItem = ({
    item,
  }: ListRenderItemInfo<LeaderboardCompetitorCurrentTrack>) => {
    const { name, countryCode, id } = item
    const rank = get(item, ['trackedColumn', 'trackedRank'])
    const { rankingMetric, selectedColumn, myCompetitorData } = this.props

    return (
      <TouchableHighlight
        style={[styles.listRowButtonContainer]}
        onPress={this.props.onCompetitorItemPress(id)}
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

export default CompetitorList
