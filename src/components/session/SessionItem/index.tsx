import React from 'react'
import {
  TouchableOpacity, View, ViewProps
} from 'react-native'
import Swipeable from 'react-native-swipeable'

import Images from '@assets/Images'
import { OnPressType } from 'helpers/types'
import I18n from 'i18n'
import { Session } from 'models'
import { navigateToSessionDetail } from 'navigation'

import SessionInfoDisplay from 'components/session/SessionInfoDisplay'
import SwipeableButton from 'components/session/SwipeableButton'

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
} > {
  public onItempPress = () => navigateToSessionDetail(this.props.session.leaderboardName)

  public render() {
    const {
      style,
      session,
    } = this.props

    const archived = false

    return (
      <View style={styles.container}>
        <Swipeable
          rightButtons={[archived ?
            UnarchiveButton(this.setArchiveValue(false))
            : ArchiveButton(this.setArchiveValue(true))]}
          rightButtonWidth={SWIPE_BUTTON_WIDTH}
        >
          <TouchableOpacity
            onPress={this.onItempPress}
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

  private setArchiveValue = (archived: boolean) => () => {}
}


export default SessionItem
