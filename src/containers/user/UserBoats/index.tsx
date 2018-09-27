import React from 'react'
import { ViewProps } from 'react-native'
import { connect } from 'react-redux'

import I18n from 'i18n'
import { Boat } from 'models'
import { getBoatsMock } from 'selectors/boat'

import AddButton from 'components/AddButton'
import BoatItem from 'components/BoatItem'
import FloatingComponentList from 'components/FloatingComponentList'


class UserBoats extends React.Component<ViewProps & {
  boats: Boat[],
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
    // TODO: open new boat screen
  }

  protected renderAddItem = () => <AddButton onPress={this.onNewBoatPress}>{I18n.t('caption_new_boat')}</AddButton>

  protected renderItem({ item }: any) {
    return <BoatItem boat={item}/>
  }
}

const mapStateToProps = (state: any) => ({
  boats: getBoatsMock(),
})

export default connect(mapStateToProps)(UserBoats)
