import React from 'react'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'


import { StyleSheetType } from 'helpers/types'
import styles from './styles'

class RegattaItem extends React.Component<{
  regatta: any,
  onPress?: () => void,
  style?: StyleSheetType,
} > {
  public static defaultProps = {
    size: 'small',
  }

  public render() {
    const {
      style,
      regatta,
      onPress,
    } = this.props

    const competitorName = regatta && regatta.competitor && regatta.competitor.name
    const markName = regatta && regatta.mark && regatta.mark.name
    const boatName = regatta && regatta.boat && regatta.boat.name

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={[styles.container, style]}>
          <View>
            <Text>
              {regatta && regatta.event && regatta.event.name}
            </Text>
            <Text>
              {regatta && regatta.leaderboard && regatta.leaderboard.name}
            </Text>
          </View>
          <View>
            <Text>
              {competitorName || markName || boatName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}


export default RegattaItem
