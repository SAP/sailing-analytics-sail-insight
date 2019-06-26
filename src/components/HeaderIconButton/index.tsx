import React from 'react'
import { Image, TouchableOpacity } from 'react-native'

import { button } from 'styles/commons'
import styles from './styles'

class HeaderIconButton extends React.Component<{
  icon: any,
  onPress: () => void,
}> {

  public render() {
    const { onPress, icon } = this.props

    return (
      <TouchableOpacity
        style={[styles.back]}
        onPress={onPress}
      >
        <Image
          style={[button.actionIconNavBar]}
          source={icon}
        />
      </TouchableOpacity>
    )
  }
}

export default HeaderIconButton
