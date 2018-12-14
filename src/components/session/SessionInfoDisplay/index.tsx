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

import { $secondaryTextColor } from 'styles/colors'
import { button, container, image, text } from 'styles/commons'
import styles from './styles'


class SessionInfoDisplay extends React.Component<ViewProps & {
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

  public renderTrackingContext = () => {
    const { session } = this.props
    let infoImage
    let infoText
    switch (session.trackingContext) {
      // case 'BOAT':
      //   infoImage = Images.info.boat
      //   infoText = session.boat && session.boat.name
      //   break
      case 'COMPETITOR':
        infoImage = Images.info.competitor
        infoText = session.competitor && session.competitor.name
        break
      case 'MARK':
        infoImage = Images.info.mark
        infoText = session.mark && session.mark.name
        break
      default:
        return
    }
    return (
      <IconText
        style={styles.infoItem}
        source={infoImage}
        iconTintColor={$secondaryTextColor}
        alignment="horizontal"
        textStyle={{ flex: 1 }}
      >
        {infoText}
      </IconText>
    )
  }

  public render() {
    const {
      style,
      session,
      eventImageSize,
      onSettingsPress,
    } = this.props

    let boatInfoText = (session.regatta && session.regatta.boatClass) || I18n.t('text_empty_value_placeholder')
    boatInfoText = boatInfoText + (session.boat && session.boat.name ? `  (${session.boat.name})` : '')

    const eventImage = getEventPreviewImageUrl(session.event)
    return (
      <View style={style}>
        {
          eventImage &&
          <Image
            style={eventImageSize === 'large' ? image.headerMediumLarge : image.headerMedium}
            source={eventImage}
          />
        }
        <View style={styles.detailContainer}>
          <View style={styles.line}>
            <View style={styles.basicInfoContainer}>
              <Text style={text.itemName}>
                {
                  session.userStrippedDisplayName ||
                  (session.leaderboard && (session.leaderboard.displayName || session.leaderboard.name))
                }
              </Text>
              <View style={[styles.line, styles.textMargins]}>
                <Text
                  style={styles.dateText}
                >
                  {dateFromToText(session.event && session.event.startDate, session.event && session.event.endDate)}
                </Text>
                <Text style={[text.propertyName, styles.tracksText]}>{`${I18n.t('text_tracks').toUpperCase()}:`}</Text>
                <Text style={styles.tracksCountText}>{size(session.regatta && session.regatta.races)}</Text>
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
            <View style={{ flex: 1 }}>
              <View style={[container.rowCentered]}>
                <IconText
                  style={[styles.infoItem, session.trackingContext === 'BOAT' ? styles.infoItemFull : undefined]}
                  source={Images.info.boat}
                  iconTintColor={$secondaryTextColor}
                  textStyle={{ flex: 1 }}
                  alignment="horizontal"
                >
                  {boatInfoText}
                </IconText>
                {this.renderTrackingContext()}
              </View>
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
              isLoading={this.state.isTrackingLoading}
              onPress={this.onTrackingPress}
            />
          </View>
        </View>
      </View>
    )
  }
}


export default SessionInfoDisplay
