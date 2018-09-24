import React from 'react'
import {
  TouchableOpacity, View, ViewProps,
} from 'react-native'

import Images from '@assets/Images'
import { Boat } from 'models'
import { navigateToBoatDetails } from 'navigation'

import Image from 'components/Image'
import Text from 'components/Text'

import I18n from 'i18n'
import { image, text } from 'styles/commons'
import styles from './styles'


class BoatItem extends React.Component<ViewProps & {
  boat: Boat,
} > {
  public onItempPress = () => navigateToBoatDetails(this.props.boat)

  public render() {
    const { boat } = this.props

    // TODO: replace with real images
    const logoImageUrl = Images.header.boat
    const boatImageUrl = Images.header.boat

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onItempPress}
      >
        {
          boatImageUrl && (
            <Image style={image.headerMedium} source={boatImageUrl}>
              {logoImageUrl && <Image style={[image.logoAbsoluteLeft, styles.logo]} source={logoImageUrl}/>}
            </Image>
          )
        }
        <View style={styles.textContainer}>
          <Text style={text.itemName}>{boat.name}</Text>
          <View style={styles.lowerTextContainer}>
            <Text style={[text.propertyValue, styles.sailNumber]}>{boat.sailNumber}</Text>
            {
              !boat.isDefault ? undefined : (
                <View style={styles.currentTag}>
                  <Text style={styles.currentTagText}>{I18n.t('text_tag_current_boat')}</Text>
                </View>
              )
            }
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}


export default BoatItem
