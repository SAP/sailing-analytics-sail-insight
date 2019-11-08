import React from 'react'
import { Image, Text, TouchableHighlight, View } from 'react-native'

import { $secondaryBackgroundColor } from 'styles/colors'
import Images from '../../../assets/Images'
import LineSeparator from '../LineSeparator'
import styles from './styles'

class AccountListItem extends React.Component<{
  title: string
  icon?: any
  onPress: () => void
  subtitle?: string
  big?: boolean,
}> {
  public render() {
    const { title, subtitle, icon, big, onPress } = this.props

    return [
        <TouchableHighlight
          underlayColor={$secondaryBackgroundColor}
          style={[styles.buttonContainer, big && styles.buttonContainerBig]}
          onPress={onPress}
        >
          <View style={styles.buttonContentContainer}>
            {icon && 
            <View style={styles.avatarContainer}>
              <Image style={[styles.baseIcon, big && styles.bigIcon]} source={icon} />
            </View>
            }
            <View style={styles.textContainer}>
              <Text
                style={subtitle ? styles.title : styles.titleWithoutSubtitle}
              >
                {subtitle ? title : title.toUpperCase()}
              </Text>
              {subtitle && (
                <View style={styles.lowerTextContainer}>
                  <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
              )}
            </View>
            <View style={styles.arrowContainer}>
              <Image
                source={Images.actions.arrowRight}
                style={styles.actionIcon}
              />
            </View>
          </View>
        </TouchableHighlight>]
  }
}

export default AccountListItem
