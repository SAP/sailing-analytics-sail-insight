import React from 'react'
import { Image, Share, TouchableOpacity } from 'react-native'

import Images from '@assets/Images'

import { button } from 'styles/commons'
import styles from './styles'

class ShareButton extends React.Component<{
  url?: string
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
    const { url } = this.props
    Share.share({ message: url || '' })
  }
}

export default ShareButton
