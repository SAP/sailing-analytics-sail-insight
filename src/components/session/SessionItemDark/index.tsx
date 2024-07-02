import Images from '@assets/Images'
import { OnPressType } from 'helpers/types'
import { Session } from 'models'
import React from 'react'
import {
  Animated, TouchableOpacity, View, ViewProps,
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { connect } from 'react-redux'

import SessionInfoDisplayDark from 'components/session/SessionInfoDisplayDark'

import { archiveEvent } from 'actions/events'

import styles from './styles'

class SessionItemDark extends React.Component<ViewProps & {
  session: Session,
  onTrackingPress?: OnPressType,
  archiveEvent: any,
  onItemPress: OnPressType,
  swipeableLeftOpenEventId: string,
  onSwipeableLeftWillOpen: any,
  swipeableReference: any
} > {
  constructor(props: any) {
    super(props)
  }

  public render() {
    const {
      style,
      session,
      onSwipeableLeftWillOpen,
    } = this.props

    const archived = session.event && session.event.archived || false
    const { eventId } = session

    const renderLeftActions = (_progress: any, dragX: any) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [-20, 0, 0, 1],
      })

      return (
        <RectButton
          style={styles.leftAction}
          onPress={() => archived ? this.setArchiveValue(false) : this.setArchiveValue(true)}
        >
          <Animated.Image
            style={[styles.actionImage, {
              transform: [{ translateX: trans }],
            }]}
            source={Images.events.archive}
          />
        </RectButton>
      )
    }

    return (
      <Swipeable
        friction={1}
        overshootLeft={false}
        leftThreshold={50}
        renderLeftActions={renderLeftActions}
        ref={this.props.swipeableReference}
        onSwipeableLeftWillOpen={() => onSwipeableLeftWillOpen(eventId)}
      >
      <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.props.onItemPress}
          >
            <SessionInfoDisplayDark
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

export default connect(null, { archiveEvent })(SessionItemDark)
