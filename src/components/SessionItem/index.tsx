import React from 'react'
import {
  TouchableOpacity,
  View,
} from 'react-native'

import Images from '@assets/Images'
import { dateFromToText } from 'helpers/date'
import { StyleSheetType } from 'helpers/types'
import I18n from 'i18n'
import { navigateToSessionDetail } from 'navigation'
import { getEventPreviewImageUrl } from 'services/SessionService'
import { $secondaryTextColor } from 'styles/colors'
import { text } from 'styles/commons'
import styles from './styles'

import IconText from 'components/IconText'
import Image from 'components/Image'
import ImageButton from 'components/ImageButton'
import Text from 'components/Text'


class SessionItem extends React.Component<{
  regatta: any,
  style?: StyleSheetType,
} > {
  public static defaultProps = {
    size: 'small',
  }

  public onStartTrackingPress = () => {
    // TODO: start Tracking
  }

  public onItempPress = () => navigateToSessionDetail(this.props.regatta)

  public render() {
    const {
      style,
      regatta,
    } = this.props

    const eventImage = getEventPreviewImageUrl(regatta.event)

    return (
      <TouchableOpacity
        onPress={this.onItempPress}
      >
        <View style={style}>
          {eventImage && <Image style={styles.coverImage} source={eventImage}/>}
          <View style={styles.detailContainer}>
            <View>
              <Text style={styles.nameText}>
                {regatta && regatta.leaderboard && regatta.leaderboard.name}
              </Text>
              <View style={[styles.line, styles.textMargins]}>
                <Text
                  style={styles.dateText}
                >
                  {dateFromToText(regatta.event.startDate, regatta.event.endDate)}
                </Text>
                <Text style={[text.propertyName, styles.tracksText]}>{`${I18n.t('text_tracks').toUpperCase()}:`}</Text>
                <Text style={styles.tracksCountText}>{1/*TODO: fill data*/}</Text>
              </View>
            </View>
            <View style={[styles.innerContainer, styles.textMargins]}>
              <View>
                <IconText
                  source={Images.info.boat}
                  iconTintColor={$secondaryTextColor}
                  alignment="horizontal"
                >
                  {'BOAT'/*TODO: fill data*/}
                </IconText>
                <IconText
                  style={styles.textMargins}
                  source={Images.info.location}
                  iconTintColor={$secondaryTextColor}
                  alignment="horizontal"
                >
                  {'LOCATION'/*TODO: fill data*/}
                </IconText>
              </View>
              <ImageButton
                source={Images.actions.recordColored}
                style={styles.trackingButton}
                imageStyle={styles.trackingImage}
                onPress={this.onStartTrackingPress}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}


export default SessionItem
