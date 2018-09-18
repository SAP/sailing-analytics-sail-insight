import React from 'react'
import {
  ListView as RNListView,
  ListViewProps,
} from 'react-native'


class ListView extends React.Component<ListViewProps> {

  public render() {
    return (
      <RNListView
        enableEmptySections={true}
        {...this.props}
      />
    )
  }
}

export default ListView
