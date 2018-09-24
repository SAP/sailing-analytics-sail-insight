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
  onPress?: OnPressType,
} > {
  public state = { isCollapsed: true }

  public handleCollapseExpand = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed })
  }

  public renderMore = () => {
    if (this.state.isCollapsed) {
      return undefined
    }
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
              {I18n.t('text_empty_value_placeholder')/*TODO: fill data*/}
            </IconText>
            <IconText
              style={styles.textMargins}
              source={Images.info.location}
              iconTintColor={$secondaryTextColor}
              alignment="horizontal"
            >
              {I18n.t('text_empty_value_placeholder')/*TODO: fill data*/}
            </IconText>
          </View>
          <ImageButton
            style={[button.secondaryActionIcon, styles.iconButton]}
            imageStyle={styles.settingsButton}
            source={Images.actions.settings}
          />
        </View>
        <TrackInfo/>
      </View>
    )
  }

  public render() {
    const {
      style,
      track,
    } = this.props

    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={[styles.container, style]}>
          <View style={styles.line}>
            <View style={styles.basicInfoContainer}>
              <Text style={text.itemName}>
                {track.name}
              </Text>
              <View style={[styles.line, styles.textMargins]}>
                <Text style={styles.dateText}>
                  {dateFromToText(track.startDate, track.endDate)}
                </Text>
                <Text style={styles.dateText}>
                  {dateFromToText(track.startDate, track.endDate, 'LT', false)}
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
