import React from 'react'
import { TouchableOpacity, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import { fetchUserInfo } from 'actions/user'
import Logger from 'helpers/Logger'
import I18n from 'i18n'
import { TeamTemplate } from 'models'
import * as Screens from 'navigation/Screens'
import { getLastUsedTeam, getUserTeams } from 'selectors/user'
import FloatingComponentList from 'components/FloatingComponentList'
import TeamItem from 'components/TeamItem'
import Text from 'components/Text'
import { button } from 'styles/commons'
import styles from './styles'

class TeamList extends React.Component<ViewProps & {
  teams: TeamTemplate[],
  lastUsedTeam?: TeamTemplate,
  fetchUserInfo: () => void,
}> {

  public state = {
    refreshing: false,
  }

  public render() {
    return (
      <FloatingComponentList
        style={styles.list}
        data={this.props.teams}
        renderItem={this.renderItem}
        renderFloatingItem={this.renderAddItem}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
        hideFloatingItemOnScroll={false}
      />
    )
  }

  protected onRefresh = async () => {
    this.setState({ refreshing: true })
    try {
      await this.props.fetchUserInfo()
    } catch (err) {
      Logger.warn(err)
    } finally {
      this.setState({ refreshing: false })
    }
  }

  protected renderAddItem = () => {
    return(
      <TouchableOpacity
        style={[button.actionRectangular, styles.addButton]}
        onPress={() => this.props.navigation.navigate(Screens.TeamDetails)}>
        <Text style={styles.textStyle}>
          {I18n.t('caption_new_team').toUpperCase()}
        </Text>
      </TouchableOpacity>
    )
  }

  protected renderItem = ({ item }: {item: TeamTemplate}) => {
    const { lastUsedTeam } = this.props
    return <TeamItem
      lastUsed={lastUsedTeam && lastUsedTeam.name === item.name}
      onPress={() => this.props.navigation.navigate(Screens.TeamDetails,  { data: item })}
      team={item}/>
  }
}

const mapStateToProps = (state: any) => ({
  teams: getUserTeams(state),
  lastUsedBoat: getLastUsedTeam(state),
})

export default connect(mapStateToProps, { fetchUserInfo })(TeamList)
