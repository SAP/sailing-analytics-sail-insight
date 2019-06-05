import Text from 'components/Text'

import { TeamTemplate } from 'models'
import { navigateToTeamDetails } from 'navigation'
import React from 'react'
import { TouchableOpacity, View, ViewProps } from 'react-native'

import { $placeholderBackgroundColor } from 'styles/colors'
import { image, text } from 'styles/commons'
import Images from '../../../assets/Images'
import { getDataUriOrPath } from '../../helpers/images'
import Image from '../Image'
import styles from './styles'


class TeamItem extends React.Component<ViewProps & {
  team: TeamTemplate,
  lastUsed?: boolean,
} > {
  public onItemPress = () => navigateToTeamDetails(this.props.team)

  public render() {
    const { team } = this.props
    const imageValue = getDataUriOrPath(team.imageData)
    const placeholderStyle = !imageValue ? { backgroundColor: $placeholderBackgroundColor } : undefined

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onItemPress}
      >
        <Image
          style={[image.headerMediumLarge, placeholderStyle]}
          source={imageValue || Images.header.team}
        />
        <View style={styles.textContainer}>
          <Text style={text.itemName}>{team.name}</Text>
          <View style={styles.lowerTextContainer}>
            <Text style={[text.propertyValue, styles.sailNumber]}>{team.sailNumber}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default TeamItem
