import React from 'react'
import {
  ActivityIndicator, TouchableOpacity, View, ViewProps, Animated
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
  loading?: boolean,
  swipeableLeftOpenEventId: string,
  onSwipeableLeftWillOpen: any,
} > {
  constructor(props) {
    super(props)
    this.swipeableRef = React.createRef()
  }

  public state = {
    isArchiving: false,
  }

  public render() {
    const {
      style,
      session,
      loading = false,
      swipeableLeftOpenEventId,
      onSwipeableLeftWillOpen,
    } = this.props

    const archived = !!session.isArchived
    const { eventId } = session

    if (swipeableLeftOpenEventId != eventId) {
      this.swipeableRef?.current?.close()
    }

    const renderLeftActions = (progress, dragX) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [-20, 0, 0, 1],
      })
      return (
        <RectButton
          style={styles.leftAction}
          onPress={() => archived ? this.setArchiveValue(false) : this.setArchiveValue(true)}
        >
          {this.state.isArchiving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Animated.Image
              style={[styles.actionImage, { transform: [{ translateX: trans }] }]}
              source={Images.events.archive}
            />
          )}
        </RectButton>
      )
    }

    return (
      <Swipeable
        friction={1}
        overshootLeft={false}
        leftThreshold={50}
        renderLeftActions={renderLeftActions}
        ref={this.swipeableRef}
        onSwipeableLeftWillOpen={() => onSwipeableLeftWillOpen(eventId)}
      >
      <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.props.onItemPress}
          >
            <SessionInfoDisplay
              style={style}
              session={session}
              onTrackingPress={this.props.onTrackingPress}
              loading={loading}
            />
          </TouchableOpacity>
      </View>
      </Swipeable>
    )
  }

  private setArchiveValue = async (archived: boolean) => {
    this.setState({ isArchiving: true })
    await this.props.archiveEvent(this.props.session, archived)
    this.setState({ isArchiving: false })
  }
}

export default connect(null, { archiveEvent })(SessionItem)
