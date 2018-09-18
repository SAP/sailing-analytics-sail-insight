import React from 'react'
import { ListViewDataSource, View } from 'react-native'
import { connect } from 'react-redux'

import { getListViewDataSource } from 'helpers/utils'
import { getUserTracks } from 'selectors/checkIn'
import { container } from 'styles/commons'

import ListView from 'components/ListView'
import TrackItem from 'components/session/TrackItem'


class Tracks extends React.Component<{
  dataSource: ListViewDataSource,
} > {


  public renderItem(track: any) {
    return <TrackItem track={track}/>
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
  dataSource: getListViewDataSource(getUserTracks(state)),
})

export default connect(mapStateToProps)(Tracks)
