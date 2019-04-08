import React from 'react'
import { ViewProps } from 'react-native'
import { connect } from 'react-redux'

import I18n from 'i18n'
import { BoatTemplate } from 'models'
import { navigateToBoatDetails } from 'navigation'
import { getLastUsedBoat, getUserBoats } from 'selectors/user'

import AddButton from 'components/AddButton'
import BoatItem from 'components/BoatItem'
import FloatingComponentList from 'components/FloatingComponentList'


class UserBoats extends React.Component<ViewProps & {
  boats: BoatTemplate[],
  lastUsedBoat?: BoatTemplate,
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
    navigateToBoatDetails()
  }

  protected renderAddItem = () => <AddButton onPress={this.onNewBoatPress}>{I18n.t('caption_new_boat')}</AddButton>

  protected renderItem = ({ item }: {item: BoatTemplate}) => {
    const { lastUsedBoat } = this.props
    return (
      <BoatItem
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

export default connect(mapStateToProps)(UserBoats)
