import Text from 'components/Text'

import { TeamTemplate } from 'models'
import { navigateToTeamDetails } from 'navigation'
import React from 'react'
import { TouchableOpacity, View, ViewProps } from 'react-native'

import { text } from 'styles/commons'
import styles from './styles'


class TeamItem extends React.Component<ViewProps & {
  team: TeamTemplate,
  lastUsed?: boolean,
} > {
  public onItemPress = () => navigateToTeamDetails(this.props.team)

  public render() {
    const { team } = this.props

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onItemPress}
      >
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
