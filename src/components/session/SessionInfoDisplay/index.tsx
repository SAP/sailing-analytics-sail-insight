import { size } from 'lodash'
import React from 'react'
import {
  View,
  ViewProps,
} from 'react-native'

import Images from '@assets/Images'
import { dateFromToText } from 'helpers/date'
import { OnPressType } from 'helpers/types'
import I18n from 'i18n'
import { Session } from 'models'
import { getEventPreviewImageUrl } from 'services/SessionService'

import IconText from 'components/IconText'
import Image from 'components/Image'
import ImageButton from 'components/ImageButton'
import Text from 'components/Text'
import ActivityIndicator from 'components/ActivityIndicator'

import { button, text } from 'styles/commons'
import styles from './styles'
import { $smallSpacing } from 'styles/dimensions';


class SessionInfoDisplay extends React.Component<ViewProps & {
  session: Session,
  eventImageSize?: 'large' | 'medium',
  onTrackingPress?: OnPressType,
  onSettingsPress?: OnPressType,
  loading?: boolean
} > {

  public state = { isTrackingLoading: false }

  public onTrackingPress = async (event: any) => {
    if (!this.props.onTrackingPress) {
      return
    }
    try {
      await this.setState({ isTrackingLoading: true })
      await this.props.onTrackingPress(event)
    } catch (err) {
      throw err
    } finally {
      this.setState({ isTrackingLoading: false })
    }
  }

  public render() {
    const {
      style,
      session,
      onSettingsPress,
      loading = false,
    } = this.props

    let boatInfoText = (session.regatta && session.regatta.boatClass) || I18n.t('text_empty_value_placeholder')
    boatInfoText = boatInfoText + (session.boat && session.boat.name ? `  (${session.boat.name})` : '')

    const eventImage = getEventPreviewImageUrl(session.event)
    return (
      <View style={style}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={eventImage ? eventImage : Images.events.placeholder_event_pic}
          />
        </View>
        <View style={styles.detailContainer}>
          <View style={styles.line}>
            <View style={styles.basicInfoContainer}>
              <Text
                style={styles.dateText}
              >
                {dateFromToText(session.event && session.event.startDate, session.event && session.event.endDate)}
              </Text>
              <View style={[styles.line, styles.textMargins]}>
                <Text
                  style={[text.itemName, styles.itemText]}
                  numberOfLines={1}
                  allowFontScaling={false}
                  ellipsizeMode="tail"
                >
                {
                  (session.event && session.event.name) ||
                  session.userStrippedDisplayName ||
                  (session.leaderboard && (session.leaderboard.displayName || session.leaderboard.name))
                }
                </Text>
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
        </View>
        <View style={styles.arrowContainer}>
        {
          loading ? (
            <ActivityIndicator style={styles.spinnerStyle} size="small" color="black" />
          ) : (
            <Image source={Images.actions.arrowRight} />
          )
        }
        </View>
      </View>
    )
  }
}


export default SessionInfoDisplay
