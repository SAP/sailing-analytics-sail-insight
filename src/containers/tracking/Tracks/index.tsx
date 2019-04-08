import React from 'react'
import { FlatList, View } from 'react-native'
import { connect } from 'react-redux'

import { openTrackDetails } from 'actions/navigation'
import { listKeyExtractor } from 'helpers/utils'
import { Race } from 'models'
import { getUserRaces } from 'selectors/race'
import { container } from 'styles/commons'

import TrackItem from 'components/session/TrackItem'


class Tracks extends React.Component<{
  tracks: Race[],
  openTrackDetails: (race: Race) => void,
} > {

  public onTrackPress = (race: Race) => () => {
    this.props.openTrackDetails(race)
  }

  public renderItem = ({ item }: any) => {
    return <TrackItem onPress={this.onTrackPress(item)} track={item}/>
  }

  public render() {
    return (
      <View style={container.list}>
        <FlatList
          data={this.props.tracks}
          renderItem={this.renderItem}
          keyExtractor={listKeyExtractor}
        />
      </View>
    )
  }
}

const mapStateToProps = (state: any) => ({
  tracks: getUserRaces(state),
})

export default connect(mapStateToProps, { openTrackDetails })(Tracks)
