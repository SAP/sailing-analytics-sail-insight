import React from 'react'
import {
  ListView,
} from 'react-native'
import { connect } from 'react-redux'

import { insertTestCheckIns } from 'actions/checkIn'
import { StyleSheetType } from 'helpers/types'
import { getListViewDataSource } from 'helpers/utils'
import { getCheckInList } from 'selectors/checkIn'

import SessionItem from 'components/SessionItem'


class SessionList extends React.Component<{
  insertTestCheckIns: () => void,
  regattaDataSource: any,
  style?: StyleSheetType,
  onScrollBeginDrag?: () => void,
  onScrollEndDrag?: () => void,
  onMomentumScrollBegin?: () => void,
  onMomentumScrollEnd?: () => void,
} > {

  public componentDidMount() {
    this.props.insertTestCheckIns()
  }

  public renderItem(regatta: any) {
    return <SessionItem regatta={regatta}/>
  }

  public render() {
    const { insertTestCheckIns: n, regattaDataSource: m, ...remainingProps } = this.props
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.props.regattaDataSource}
        renderRow={this.renderItem}
        {...remainingProps}
      />
    )
  }
}

const mapStateToProps = (state: any) => ({
  regattaDataSource: getListViewDataSource(getCheckInList(state)),
})

export default connect(mapStateToProps, { insertTestCheckIns })(SessionList)
