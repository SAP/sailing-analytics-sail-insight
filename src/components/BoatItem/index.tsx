import Text from 'components/Text'

import { BoatTemplate } from 'models'
import { navigateToBoatDetails } from 'navigation'
import React from 'react'
import { TouchableOpacity, View, ViewProps } from 'react-native'

import { text } from 'styles/commons'
import styles from './styles'


class BoatItem extends React.Component<ViewProps & {
  boat: BoatTemplate,
  lastUsed?: boolean,
} > {
  public onItempPress = () => navigateToBoatDetails(this.props.boat)

  public render() {
    const { boat } = this.props

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onItempPress}
      >
        <View style={styles.textContainer}>
          <Text style={text.itemName}>{boat.name}</Text>
          <View style={styles.lowerTextContainer}>
            <Text style={[text.propertyValue, styles.sailNumber]}>{boat.sailNumber}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default BoatItem
