import React from 'react'
import {
  TouchableOpacity, View, ViewProps, Animated
} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import Images from '@assets/Images'
import { OnPressType } from 'helpers/types'
import I18n from 'i18n'
import { Session } from 'models'

import SessionInfoDisplay from 'components/session/SessionInfoDisplay'

import { archiveEvent } from 'actions/events'

import styles from './styles'

class SessionItem extends React.Component<ViewProps & {
  session: Session,
  onTrackingPress?: OnPressType,
  archiveEvent: any,
  onItemPress: OnPressType,
} > {
  public render() {
    const {
      style,
      session,
    } = this.props

    const archived = session.event && session.event.archived || false

    const renderLeftActions = (progress, dragX) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [-20, 0, 0, 1],
      });
      return (
        <RectButton style={styles.leftAction}
          onPress={() => archived ? this.setArchiveValue(false) : this.setArchiveValue(true)}>
          <Animated.Image style={[styles.actionImage, {
                transform: [{ translateX: trans }],
              }]}
            source={Images.events.archive}>
          </Animated.Image>
        </RectButton>
      );
    };

    return (
      <Swipeable
        friction={1}
        overshootLeft={false}
        leftThreshold={50}
        renderLeftActions={renderLeftActions}>
      <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.props.onItemPress}>
            <SessionInfoDisplay
              style={style}
              session={session}
              onTrackingPress={this.props.onTrackingPress}
            />
          </TouchableOpacity>
      </View>
      </Swipeable>
    )
  }

  private setArchiveValue = (archived: boolean) => {
    this.props.archiveEvent(this.props.session, archived)
  }
}

export default connect(null, { archiveEvent })(SessionItem)
