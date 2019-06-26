import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import styles from './styles'

class SwipeableButton extends React.Component<{
  text: string
  icon: any
  backgroundColor: string
  width: number
  onPress: () => void
}> {
  public render() {
    const { text, icon, backgroundColor, width, onPress } = this.props

    return (
      <View style={[styles.buttonContainer, { backgroundColor }]}>
        <TouchableOpacity
          onPress={onPress}
          style={[styles.button, { backgroundColor, width }]}
        >
          <View style={styles.buttonContentContainer}>
            <Image source={icon} style={styles.icon}/>
            <Text style={styles.text}>{text}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

export default SwipeableButton
