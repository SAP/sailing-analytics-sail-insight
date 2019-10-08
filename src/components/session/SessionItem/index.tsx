import React from 'react'
import {
  TouchableOpacity, ViewProps,
} from 'react-native'

import { OnPressType } from 'helpers/types'
import { Session } from 'models'

import SessionInfoDisplay from 'components/session/SessionInfoDisplay'


class SessionItem extends React.Component<ViewProps & {
  session: Session,
  onTrackingPress?: OnPressType,
  onItemPress: onPressType,
} > {
  public render() {
    const {
      style,
      session,
    } = this.props

    return (
      <TouchableOpacity
        onPress={this.props.onItemPress}
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
