import React from 'react'
import {
  TouchableOpacity, ViewProps,
} from 'react-native'

import { navigateToSessionDetail } from 'navigation'

import SessionInfoDisplay from 'components/session/SessionInfoDisplay'


class SessionItem extends React.Component<ViewProps & {
  regatta: any,
} > {
  public onStartTrackingPress = () => {
    // TODO: start Tracking
  }

  public onItempPress = () => navigateToSessionDetail(this.props.regatta)

  public render() {
    const {
      style,
      regatta = {},
    } = this.props

    return (
      <TouchableOpacity
        onPress={this.onItempPress}
      >
        <SessionInfoDisplay style={style} session={regatta}/>
      </TouchableOpacity>
    )
  }
}


export default SessionItem
