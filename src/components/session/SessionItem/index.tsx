import React from 'react'
import {
  TouchableOpacity, ViewProps,
} from 'react-native'

import { OnPressType } from 'helpers/types'
import { Session } from 'models'
import { navigateToSessionDetail } from 'navigation'

import SessionInfoDisplay from 'components/session/SessionInfoDisplay'


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

    return (
      <TouchableOpacity
        onPress={this.onItempPress}
      >
        <SessionInfoDisplay
          style={style}
          session={session}
          onTrackingPress={this.props.onTrackingPress}
        />
      </TouchableOpacity>
    )
  }
}


export default SessionItem
