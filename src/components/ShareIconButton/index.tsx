import React from 'react'
import { Image, Share, TouchableOpacity } from 'react-native'

import Images from '@assets/Images'
import I18n from 'i18n'

import { button } from 'styles/commons'
import styles from './styles'

class ShareButton extends React.Component<{
  url?: string
  eventName?: string
}> {

  public render() {
    return (
      <TouchableOpacity
        style={[styles.back]}
        onPress={this.onPress}
      >
        <Image
          style={[button.actionIconNavBar]}
          source={Images.actions.share}
        />
      </TouchableOpacity>
    )
  }

  private onPress = () => {
    const { url = '', eventName = '' } = this.props

    const message = `${I18n.t('text_track_share')}${eventName} ${url}`

    Share.share({ message })
  }
}

export default ShareButton
