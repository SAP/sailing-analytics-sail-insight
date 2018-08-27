import React from 'react'
import {
  TouchableOpacity,
  View,
} from 'react-native'

import IconText from 'components/IconText'
import Text from 'components/Text'

import Images from '@assets/Images'
import { dateFromToText } from 'helpers/date'
import { StyleSheetType } from 'helpers/types'
import I18n from 'i18n'
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
            <Text style={styles.nameText}>
              {regatta && regatta.leaderboard && regatta.leaderboard.name}
            </Text>
            {/* <Text>
              {regatta && regatta.event && regatta.event.name}
            </Text> */}
            <View style={styles.line}>
              <Text style={styles.dateText}>{dateFromToText(regatta.event.startDate, regatta.event.endDate)}</Text>
              <Text style={styles.tracksText}>{`${I18n.t('text_tracks').toUpperCase()}:`}</Text>
              <Text style={styles.tracksCountText}>{1/*TODO: fill data*/}</Text>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <View>
              <IconText style={styles.iconText} source={Images.info.boat}>{'BOAT'}</IconText>
              <IconText style={styles.iconText} source={Images.info.location}>{'LOCATION'}</IconText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}


export default RegattaItem
