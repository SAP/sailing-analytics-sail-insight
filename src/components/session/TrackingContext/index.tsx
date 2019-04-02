import React from 'react'
import {
  Image, View, ViewProps,
} from 'react-native'

import Images from '@assets/Images'
import { Session } from 'models'
import IconText from 'components/IconText'

import { $secondaryTextColor } from 'styles/colors'
import styles from './styles'


class TrackingContext extends React.Component<ViewProps & {
  session: Session,
  withoutBoat?: Boolean,
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
    const { session } = this.props
    this.getTrackingContext()

    if (!this.state.infoImage) return null

    return (
      <IconText
        style={styles.infoItem}
        source={this.state.infoImage}
        iconTintColor={$secondaryTextColor}
        alignment="horizontal"
        textStyle={{ flex: 1 }}
      >
        {this.state.infoText}
      </IconText>
    )
  }
}

export default TrackingContext
