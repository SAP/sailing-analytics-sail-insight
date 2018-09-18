import React from 'react'
import {
  ListView, ListViewProps,
} from 'react-native'
import { connect } from 'react-redux'

import { getListViewDataSource } from 'helpers/utils'
import { getSessionTracks } from 'selectors/checkIn'

import TrackItem from 'components/session/TrackItem'


class TrackList extends React.Component<ListViewProps & {
  leaderboardName: string,
  trackDataSource: any,
} > {
  public renderItem(track: any) {
    return <TrackItem track={track}/>
  }

  public render() {
    const { trackDataSource, ...remainingProps } = this.props
    return (
      <ListView
        enableEmptySections={true}
        dataSource={trackDataSource}
        renderRow={this.renderItem}
        {...remainingProps}
      />
    )
  }
}

const mapStateToProps = (state: any, props: any) => ({
  trackDataSource: getListViewDataSource(getSessionTracks(props.leaderboardName)(state)),
})

export default connect(mapStateToProps)(TrackList)
