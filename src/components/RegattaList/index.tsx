import React from 'react'
import {
  ListView,
  Text,
  View,
} from 'react-native'
import Hyperlink from 'react-native-hyperlink'
import { connect } from 'react-redux'

import { insertTestCheckIns } from 'actions/checkIn'
import { getListViewDataSource } from 'helpers/utils'
import I18n from 'i18n'
import { navigateToTracking } from 'navigation'
import { getCheckInList } from 'selectors/checkIn'

import RegattaItem from 'components/RegattaItem'

import styles from './styles'


class RegattaList extends React.Component<{
  insertTestCheckIns: () => void,
  regattaDataSource: any,
} > {

  public componentDidMount() {
    this.props.insertTestCheckIns()
  }

  public renderHeader() {
    return (
      <View style={styles.header}>
        <Text>
          {I18n.t('text_more_information_at')}
        </Text>
        <Hyperlink
          style={styles.hyperLink}
          linkStyle={styles.hyperLinkText}
          linkDefault={true}
        >
          <Text>
            {'https://sapsailing.com'}
          </Text>
        </Hyperlink>
      </View>
    )
  }

  public renderItem(regatta: any) {
    return (
      <RegattaItem
        regatta={regatta}
        onPress={() => navigateToTracking(regatta)}
      />
    )
  }

  public render() {
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.props.regattaDataSource}
        renderRow={this.renderItem}
        renderHeader={this.renderHeader}
      />
    )
  }
}

const mapStateToProps = (state: any) => ({
  regattaDataSource: getListViewDataSource(getCheckInList(state)),
})

export default connect(mapStateToProps, { insertTestCheckIns })(RegattaList)
