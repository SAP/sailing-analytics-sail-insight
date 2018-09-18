import React from 'react'
import {
  View,
  ViewProps,
} from 'react-native'

import Images from '@assets/Images'
import { dateFromToText } from 'helpers/date'
import I18n from 'i18n'
import { getEventPreviewImageUrl } from 'services/SessionService'
import { $secondaryTextColor } from 'styles/colors'
import { button, image, text } from 'styles/commons'
import styles from './styles'

import IconText from 'components/IconText'
import Image from 'components/Image'
import ImageButton from 'components/ImageButton'
import Text from 'components/Text'
import { CheckIn } from 'models'


class SessionInfoDisplay extends React.Component<ViewProps & {
  session: CheckIn,
  eventImageSize?: 'large' | 'medium',
  onTrackingPress?: () => void,
  onSettingsPress?: () => void,
} > {

  public render() {
    const {
      style,
      session,
      eventImageSize,
      onTrackingPress,
      onSettingsPress,
    } = this.props

    const eventImage = getEventPreviewImageUrl(session.event)
    return (
      <View style={style}>
        {
          eventImage &&
          <Image
            style={eventImageSize === 'large' ? image.headerLarge : image.headerMedium}
            source={eventImage}
          />
        }
        <View style={styles.detailContainer}>
          <View style={styles.line}>
            <View style={styles.basicInfoContainer}>
              <Text style={styles.nameText}>
                {session.leaderboard && (session.leaderboard.displayName || session.leaderboard.name)}
              </Text>
              <View style={[styles.line, styles.textMargins]}>
                <Text
                  style={styles.dateText}
                >
                  {dateFromToText(session.event && session.event.startDate, session.event && session.event.endDate)}
                </Text>
                <Text style={[text.propertyName, styles.tracksText]}>{`${I18n.t('text_tracks').toUpperCase()}:`}</Text>
                <Text style={styles.tracksCountText}>{0/*TODO: fill data*/}</Text>
              </View>
            </View>
            {
              onSettingsPress &&
              <ImageButton
                style={[button.secondaryActionIcon, styles.settingsButton]}
                source={Images.actions.settings}
                onPress={onSettingsPress}
              />
            }
          </View>
          <View style={[styles.innerContainer, styles.textMargins]}>
            <View>
              <IconText
                source={Images.info.boat}
                iconTintColor={$secondaryTextColor}
                alignment="horizontal"
              >
                {I18n.t('text_empty_value_placeholder')/*TODO: fill data*/}
              </IconText>
              <IconText
                style={styles.textMargins}
                source={Images.info.location}
                iconTintColor={$secondaryTextColor}
                alignment="horizontal"
              >
                {session.event && session.event.venue && session.event.venue.name}
              </IconText>
            </View>
            <ImageButton
              source={Images.actions.recordColored}
              style={styles.trackingButton}
              imageStyle={styles.trackingImage}
              onPress={onTrackingPress}
            />
          </View>
        </View>
      </View>
    )
  }
}


export default SessionInfoDisplay
