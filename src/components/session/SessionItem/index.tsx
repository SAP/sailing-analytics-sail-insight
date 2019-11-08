import React from 'react'
import {
  TouchableOpacity, View, ViewProps
} from 'react-native'
import Swipeable from 'react-native-swipeable'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import { OnPressType } from 'helpers/types'
import I18n from 'i18n'
import { Session } from 'models'

import SessionInfoDisplay from 'components/session/SessionInfoDisplay'
import SwipeableButton from 'components/session/SwipeableButton'

import { archiveEvent } from 'actions/events'

import styles from './styles'

const SWIPE_BUTTON_WIDTH = 100

const ArchiveButton = (onPress: () => void) => (
  <SwipeableButton
    text={I18n.t('text_session_archive')}
    icon={Images.actions.decrease}
    backgroundColor="#777777"
    width={SWIPE_BUTTON_WIDTH}
    onPress={onPress}
  />
)

const UnarchiveButton = (onPress: () => void) => (
  <SwipeableButton
    text={I18n.t('text_session_unarchive')}
    icon={Images.actions.add}
    backgroundColor="#66A9E0"
    width={SWIPE_BUTTON_WIDTH}
    onPress={onPress}
  />
)

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

    return (
      <View style={styles.container}>
        <Swipeable
          rightButtons={[archived ?
            UnarchiveButton(this.setArchiveValue(false))
            : ArchiveButton(this.setArchiveValue(true))]}
          rightButtonWidth={SWIPE_BUTTON_WIDTH}
        >
          <TouchableOpacity
            onPress={this.props.onItempPress}
          >
            <SessionInfoDisplay
              style={style}
              session={session}
              onTrackingPress={this.props.onTrackingPress}
            />
          </TouchableOpacity>
        </Swipeable>
      </View>
    )
  }

  private setArchiveValue = (archived: boolean) => () => {
    this.props.archiveEvent(this.props.session, archived)
  }
}


export default connect(null, { archiveEvent })(SessionItem)
