import React from 'react'
import { Image, Text, TouchableHighlight, View } from 'react-native'

import { $secondaryBackgroundColor } from 'styles/colors'
import Images from '../../assets/Images'
import styles from './styles'

class AccountListItem extends React.Component<{
  title: string
  onPress: () => void
  subtitle?: string
  big?: boolean,
}> {
  public render() {

    return (
      <TouchableHighlight
        underlayColor={$secondaryBackgroundColor}
        style={[styles.buttonContainer, this.props.big && styles.buttonContainerBig]}
        onPress={this.props.onPress}
      >
        <View style={styles.buttonContentContainer}>
          <View style={styles.textContainer}>
            <Text
              style={this.props.subtitle ? styles.title : styles.titleWithoutSubtitle}
            >
              {this.props.subtitle ? this.props.title : this.props.title.toUpperCase()}
            </Text>
            {this.props.subtitle && (
              <View style={styles.lowerTextContainer}>
                <Text style={styles.subtitle}>{this.props.subtitle}</Text>
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
      </TouchableHighlight>)
  }
}

export default AccountListItem
