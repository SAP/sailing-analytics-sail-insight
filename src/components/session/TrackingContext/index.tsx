import React from 'react'
import { ViewProps } from 'react-native'

import Images from '@assets/Images'
import IconText from 'components/IconText'
import { Session } from 'models'

import { text } from 'styles/commons'
import { $siWhite } from 'styles/colors'


class TrackingContext extends React.Component<ViewProps & {
  session: Session,
  withoutBoat?: boolean,
} > {

  public state = {
    infoImage: null,
    infoText: null,
  }

  public getTrackingContext = () => {
    const { session, withoutBoat = false } = this.props

    switch (session.trackingContext) {
      case 'BOAT':
        if (withoutBoat) return
        this.state.infoImage = Images.info.boat
        this.state.infoText = session.boat && session.boat.name
        break
      case 'COMPETITOR':
        this.state.infoImage = Images.info.competitor
        this.state.infoText = session.competitor && session.competitor.name
        break
      case 'MARK':
        this.state.infoImage = Images.info.mark
        this.state.infoText = session.mark && session.mark.name
        break
    }
  }

  public render = () => {
    this.getTrackingContext()

    if (!this.state.infoImage) return null

    return (
      <IconText
        source={this.state.infoImage}
        iconTintColor={$siWhite}
        alignment="horizontal"
        iconStyle={{ top: -4 }}>
        {this.state.infoText}
      </IconText>
    )
  }
}

export default TrackingContext
