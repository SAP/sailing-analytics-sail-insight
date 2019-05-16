import React from 'react'
import { ViewProps } from 'react-native'
import { connect } from 'react-redux'

import I18n from 'i18n'
import { TeamTemplate } from 'models'
import { navigateToTeamDetails } from 'navigation'
import { getLastUsedBoat, getUserBoats } from 'selectors/user'

import AddButton from 'components/AddButton'
import FloatingComponentList from 'components/FloatingComponentList'
import TeamItem from 'components/TeamItem'


class TeamList extends React.Component<ViewProps & {
  boats: TeamTemplate[],
  lastUsedBoat?: TeamTemplate,
}> {

  public render() {
    return (
      <FloatingComponentList
        data={this.props.boats}
        renderItem={this.renderItem}
        renderFloatingItem={this.renderAddItem}
      />
    )
  }

  protected onNewBoatPress = () => {
    navigateToTeamDetails()
  }

  protected renderAddItem = () => <AddButton onPress={this.onNewBoatPress}>{I18n.t('caption_new_boat')}</AddButton>

  protected renderItem = ({ item }: {item: TeamTemplate}) => {
    const { lastUsedBoat } = this.props
    return (
      <TeamItem
        lastUsed={lastUsedBoat && lastUsedBoat.name === item.name}
        boat={item}
      />
    )
  }
}

const mapStateToProps = (state: any) => ({
  boats: getUserBoats(state),
  lastUsedBoat: getLastUsedBoat(state),
})

export default connect(mapStateToProps)(TeamList)
