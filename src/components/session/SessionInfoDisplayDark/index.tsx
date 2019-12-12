import React from 'react'
import {
  View,
  ViewProps,
} from 'react-native'

import Images from '@assets/Images'
import { OnPressType } from 'helpers/types'
import I18n from 'i18n'
import { Session } from 'models'
import { getEventPreviewImageUrl } from 'services/SessionService'

import Image from 'components/Image'
import ImageButton from 'components/ImageButton'
import Text from 'components/Text'

import { button, text } from 'styles/commons'
import styles from './styles'


class SessionInfoDisplayDark extends React.Component<ViewProps & {
  session: Session,
  eventImageSize?: 'large' | 'medium',
  onTrackingPress?: OnPressType,
  onSettingsPress?: OnPressType,
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
              <View style={[styles.line, styles.textMargins]}>
                <Text
                  style={[text.itemName, styles.itemText, { color: 'white' }]}
                  numberOfLines={1}
                  allowFontScaling={false}
                  ellipsizeMode="tail"
                >
                {
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
          <Image
            style={{ tintColor: 'white' }}
            source={Images.actions.arrowRight}
          />
        </View>
      </View>
    )
  }
}


export default SessionInfoDisplayDark
