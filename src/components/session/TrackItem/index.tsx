import React from 'react'
import {
  TouchableOpacity, View, ViewProps,
} from 'react-native'

import Images from '@assets/Images'
import { dateFromToText } from 'helpers/date'
import { OnPressType } from 'helpers/types'
import I18n from 'i18n'
import { Race } from 'models'

import { $secondaryTextColor } from 'styles/colors'
import { button, text } from 'styles/commons'
import styles from './styles'


import IconText from 'components/IconText'
import ImageButton from 'components/ImageButton'
import LineSeparator from 'components/LineSeparator'
import TrackInfo from 'components/session/TrackInfo'
import Text from 'components/Text'


class TrackItem extends React.Component<ViewProps & {
  track: Race,
  showFullTrackName: boolean,
  onPress?: OnPressType,
  onSettingsPress?: () => void,
} > {
  public static defaultProps = {
    showFullTrackName: true,
  }

  public state = { isCollapsed: true }

  public handleCollapseExpand = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed })
  }

  public renderMore = () => {
    if (this.state.isCollapsed) {
      return undefined
    }
    const { track } = this.props
    return (
      <View style={styles.moreContainer}>
        <LineSeparator/>
        <View style={styles.line}>
          <View style={[styles.basicInfoContainer, styles.sessionInfoContainer]}>
            <IconText
              source={Images.info.boat}
              iconTintColor={$secondaryTextColor}
              alignment="horizontal"
            >
              {track.boatClass || I18n.t('text_empty_value_placeholder')}
            </IconText>
            <IconText
              style={styles.textMargins}
              source={Images.info.location}
              iconTintColor={$secondaryTextColor}
              alignment="horizontal"
            >
              {track.venueName || I18n.t('text_empty_value_placeholder')}
            </IconText>
          </View>
          {this.props.onSettingsPress && <ImageButton
            style={[button.secondaryActionIcon, styles.iconButton]}
            imageStyle={styles.settingsButton}
            source={Images.actions.settings}
          />}
        </View>
        <TrackInfo stats={track.statistics}/>
      </View>
    )
  }

  public render() {
    const {
      style,
      track,
      showFullTrackName,
    } = this.props

    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={[styles.container, style]}>
          <View style={styles.line}>
            <View style={styles.basicInfoContainer}>
              <Text style={text.itemName}>
                {showFullTrackName ?
                    (track.userStrippedDisplayName || track.name) : (track.regattaStrippedDisplayName || track.name)}
              </Text>
              <View style={[styles.line, styles.textMargins]}>
                <Text style={styles.dateText}>
                  {
                    dateFromToText(track.startDate, track.endDate) ||
                    dateFromToText(track.trackingStartDate, track.trackingEndDate)
                  }
                </Text>
                <Text style={styles.dateText}>
                  {
                    dateFromToText(track.startDate, track.endDate, 'LT', false) ||
                    dateFromToText(track.trackingStartDate, track.trackingEndDate, 'LT', false)
                  }
                </Text>
              </View>
            </View>
            <ImageButton
              style={[button.secondaryActionIcon, styles.iconButton]}
              source={this.state.isCollapsed ? Images.actions.expandMore : Images.actions.expandLess}
              onPress={this.handleCollapseExpand}
            />
          </View>
          {this.renderMore()}
        </View>
      </TouchableOpacity>
    )
  }
}


export default TrackItem
