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
import { listKeyExtractor } from 'helpers/utils'
import styles, { normalRowValueFontSize } from './styles'

class CompetitorList extends React.Component<{
  leaderboard: LeaderboardCompetitorCurrentTrack[]
  forLeaderboard: boolean
  onCompetitorItemPress?: any
  rankingMetric?: string
  myCompetitorData?: LeaderboardCompetitorCurrentTrack
  selectedColumn?: ColumnValueType
  showHandicapValues?: boolean
}> {
  public render() {
    return (
      <FlatList
        data={this.props.leaderboard}
        contentContainerStyle={[styles.listContentContainer]}
        renderItem={this.renderItem}
        keyExtractor={listKeyExtractor}
        nestedScrollEnabled={true}
      />
    )
  }

  private renderItemInnerContent = item => {
    const { forLeaderboard } = this.props
    const { name, countryCode } = item

    if (forLeaderboard) {
      const rank = get(item, ['trackedColumn', 'rank'])
      const { rankingMetric, selectedColumn, myCompetitorData } = this.props
      return (
        <>
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
        </>
      )
    }

    const { showHandicapValues = false } = this.props
    const { timeOnTimeFactor, nationalityISO2 } = item

    return (
      <>
        <View style={[styles.textContainer, styles.itemTextContainer]}>
          <Flag
            code={countryCode || nationalityISO2}
            size={normalRowValueFontSize}
          />
          <View style={styles.itemTextContainer}>
            <Text style={[styles.nameText, { maxWidth: undefined }]}>{name || EMPTY_VALUE}</Text>
          </View>
        </View>
        {showHandicapValues &&
          <View style={[styles.textContainer, { flex: 0 }]}>
            <Text style={[styles.gapText, styles.handicapValueText]}>
              {timeOnTimeFactor !== undefined ? timeOnTimeFactor.toFixed(2) : ''}
            </Text>
          </View>
        }
      </>
    )
  }

  private renderItem = ({
    item,
  }: ListRenderItemInfo<LeaderboardCompetitorCurrentTrack>) => {
    const { id } = item
    const { onCompetitorItemPress } = this.props

    return (
      <TouchableHighlight
        style={[styles.listRowButtonContainer]}
        disabled={!onCompetitorItemPress}
        onPress={() => onCompetitorItemPress(id)}>
        <View style={[styles.listRowContainer]}>
          <View style={[styles.listItemContainer]}>
            {this.renderItemInnerContent(item)}
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

export default CompetitorList
