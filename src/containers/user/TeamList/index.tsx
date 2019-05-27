import React from 'react'
import { ViewProps } from 'react-native'
import { connect } from 'react-redux'

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
}> {

  public render() {
    return (
      <FloatingComponentList
        data={this.props.teams}
        renderItem={this.renderItem}
        renderFloatingItem={this.renderAddItem}
      />
    )
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

export default connect(mapStateToProps)(TeamList)
