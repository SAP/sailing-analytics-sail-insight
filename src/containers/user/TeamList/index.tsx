import React from 'react'
import { ViewProps } from 'react-native'
import { connect } from 'react-redux'

import { fetchUserInfo } from 'actions/user'
import Logger from 'helpers/Logger'
import I18n from 'i18n'
import { TeamTemplate } from 'models'
import { navigateToTeamDetails } from 'navigation'
import { getLastUsedTeam, getUserTeams } from 'selectors/user'

import AddButton from 'components/AddButton'
import FloatingComponentList from 'components/FloatingComponentList'
import TeamItem from 'components/TeamItem'


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
        data={this.props.teams}
        renderItem={this.renderItem}
        renderFloatingItem={this.renderAddItem}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
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

  protected onNewBoatPress = () => {
    navigateToTeamDetails()
  }

  protected renderAddItem = () => <AddButton onPress={this.onNewBoatPress}>{I18n.t('caption_new_team')}</AddButton>

  protected renderItem = ({ item }: {item: TeamTemplate}) => {
    const { lastUsedTeam } = this.props
    return (
      <TeamItem
        lastUsed={lastUsedTeam && lastUsedTeam.name === item.name}
        team={item}
      />
    )
  }
}

const mapStateToProps = (state: any) => ({
  teams: getUserTeams(state),
  lastUsedBoat: getLastUsedTeam(state),
})

export default connect(mapStateToProps, { fetchUserInfo })(TeamList)
