import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { ListViewDataSource, TouchableOpacity, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'


import Images from '@assets/Images'
import { navigateToNewSession } from 'navigation'
import { button, container } from 'styles/commons'

import { openLocationTracking } from 'actions/locations'
import { settingsActionSheetOptions } from 'helpers/actionSheets'
import { ShowActionSheetType } from 'helpers/types'
import I18n from 'i18n'
import { generateNewSession } from 'services/SessionService'
import styles from './styles'

import { getListViewDataSource } from 'helpers/utils'
import { CheckIn, Session } from 'models'
import { NavigationScreenProps } from 'react-navigation'
import { getSessionList } from 'selectors/session'

import EmptySessionsHeader from 'components/EmptySessionsHeader'
import IconText from 'components/IconText'
import ListView from 'components/ListView'
import SessionItem from 'components/session/SessionItem'


@connectActionSheet
class Sessions extends React.Component<ViewProps & NavigationScreenProps & {
  showActionSheetWithOptions: ShowActionSheetType,
  dataSource: ListViewDataSource,
  openLocationTracking: (checkIn: CheckIn) => void,
} > {

  public state = {
    hideAddButton: false,
  }

  public componentDidMount() {
    this.props.navigation.setParams({ onOptionsPressed: this.onOptionsPressed })
  }

  public onTrackingPress = (checkIn: CheckIn) => () => this.props.openLocationTracking(checkIn)

  public renderAddItem() {
    return !this.state.hideAddButton && (
      <TouchableOpacity
          style={[button.actionRectangular, styles.addButton]}
          onPress={this.onNewSessionPress}
      >
        <IconText
          source={Images.actions.add}
          textStyle={button.actionText}
          iconTintColor="white"
          alignment="horizontal"
        >
          {I18n.t('caption_new_session')}
        </IconText>
      </TouchableOpacity>
    )
  }

  public renderHeader() {
    return <EmptySessionsHeader/>
  }

  public renderItem = (session: Session) => {
    return <SessionItem onTrackingPress={this.onTrackingPress(session)} session={session}/>
  }

  public render() {

    return (
      <View style={container.list}>
        <ListView
          dataSource={this.props.dataSource}
          onScrollBeginDrag={this.hideAdd}
          onScrollEndDrag={this.showAdd}
          onMomentumScrollBegin={this.hideAdd}
          onMomentumScrollEnd={this.showAdd}
          renderHeader={this.renderHeader}
          renderRow={this.renderItem}
        />
        {this.renderAddItem()}
      </View>
    )
  }

  protected onNewSessionPress = () => {
    navigateToNewSession(generateNewSession())
  }

  protected onOptionsPressed = () => {
    this.props.showActionSheetWithOptions(...settingsActionSheetOptions)
  }

  protected showAdd = () => {
    this.setState({ hideAddButton: false })
  }

  protected hideAdd = () => {
    this.setState({ hideAddButton: true })
  }
}

const mapStateToProps = (state: any) => ({
  dataSource: getListViewDataSource(getSessionList(state)),
})

export default connect(mapStateToProps, { openLocationTracking })(Sessions)
