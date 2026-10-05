import React from 'react'
import {
  ActivityIndicator, TouchableOpacity, View, ViewProps, Animated
} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import Snackbar from 'react-native-snackbar'
import I18n from 'i18n'
import Images from '@assets/Images'
import { OnPressType } from 'helpers/types'
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
  swipeableReference: any,
} > {

  constructor(props: any) {
    super(props)
  }

  public state = {
    isArchiving: false,
  }

  public render() {
    const {
      style,
      session,
      loading = false,
      onSwipeableLeftWillOpen,
    } = this.props

    const archived = !!session.isArchived
    const { eventId } = session

    const renderLeftActions = (_progress: any, dragX: any) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [-20, 0, 0, 1],
      })
      return (
        <RectButton
          style={styles.leftAction}
          testID="e2e-archive-event"
          accessible
          accessibilityRole="button"
          accessibilityLabel={I18n.t(archived ? 'caption_unarchive_event' : 'caption_archive_event')}
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
        ref={this.props.swipeableReference}
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

  public componentDidMount() {
    this.mounted = true
  }

  public componentWillUnmount() {
    this.mounted = false
  }

  private mounted = false

  private setArchiveValue = async (archived: boolean) => {
    if (this.state.isArchiving) {
      return
    }
    this.setState({ isArchiving: true })
    let saved = false
    try {
      // archiveEvent reverts its local change and shows the error itself on failure
      saved = await this.props.archiveEvent(this.props.session, archived)
    } finally {
      if (this.mounted) {
        this.setState({ isArchiving: false })
      }
    }
    if (saved && archived) {
      // the row disappears from the list: offer to take it back
      Snackbar.show({
        text: I18n.t('text_event_archived'),
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: I18n.t('caption_undo').toUpperCase(),
          onPress: () => this.props.archiveEvent(this.props.session, false),
        },
      })
    }
  }
}

export default connect(null, { archiveEvent })(SessionItem)
