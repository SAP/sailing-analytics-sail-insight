import React from 'react'
import { ListViewDataSource, View } from 'react-native'
import { connect } from 'react-redux'

import { openTrackDetails } from 'actions/navigation'
import { getListViewDataSource } from 'helpers/utils'
import { Race } from 'models'
import { getUserRaces } from 'selectors/race'
import { container } from 'styles/commons'

import ListView from 'components/ListView'
import TrackItem from 'components/session/TrackItem'


class Tracks extends React.Component<{
  dataSource: ListViewDataSource,
  openTrackDetails: (race: Race) => void,
} > {

  public onTrackPress = (race: Race) => () => {
    this.props.openTrackDetails(race)
  }

  public renderItem = (track: Race) => {
    return <TrackItem onPress={this.onTrackPress(track)} track={track}/>
  }

  public render() {
    return (
      <View style={container.list}>
        <ListView
          dataSource={this.props.dataSource}
          renderRow={this.renderItem}
        />
      </View>
    )
  }
}

const mapStateToProps = (state: any) => ({
  dataSource: getListViewDataSource(getUserRaces(state)),
})

export default connect(mapStateToProps, { openTrackDetails })(Tracks)
