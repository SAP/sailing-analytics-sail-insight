import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Text,
  ListView,
  View,
} from 'react-native'
import Hyperlink from 'react-native-hyperlink'

import I18n from 'i18n'
import { getListViewDataSource } from 'helpers/utils'
import { getCheckInList } from 'selectors/checkIn'

import styles from './styles'


class RegattaList extends Component {
  static propTypes = {
    regattaDataSource: PropTypes.shape({}).isRequired,
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <Text>
          {I18n.t('text_more_information_at')}
        </Text>
        <Hyperlink
          style={styles.hyperLink}
          linkStyle={styles.hyperLinkText}
          linkDefault
        >
          <Text>
            {'https://sapsailing.com'}
          </Text>
        </Hyperlink>
      </View>
    )
  }

  renderItem(regatta) {
    return (
      <View>
        <Text>
          {JSON.stringify(regatta)}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <ListView
        enableEmptySections
        dataSource={this.props.regattaDataSource}
        renderRow={this.renderItem}
        renderHeader={this.renderHeader}
      />
    )
  }
}

const mapStateToProps = state => ({
  regattaDataSource: getListViewDataSource(getCheckInList(state)),
})

export default connect(mapStateToProps)(RegattaList)
