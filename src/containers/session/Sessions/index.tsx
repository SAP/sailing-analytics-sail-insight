import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { ViewProps } from 'react-native'
import { connect } from 'react-redux'

import { navigateToNewSession } from 'navigation'

import { openLocationTracking } from 'actions/locations'
import { settingsActionSheetOptions } from 'helpers/actionSheets'
import { ShowActionSheetType } from 'helpers/types'
import I18n from 'i18n'
import { generateNewSession } from 'services/SessionService'

import { authBasedNewSession } from 'actions/auth'
import { CheckIn, Session } from 'models'
import { NavigationScreenProps } from 'react-navigation'
import { getSessionList } from 'selectors/session'

import AddButton from 'components/AddButton'
import EmptySessionsHeader from 'components/EmptySessionsHeader'
import FloatingComponentList from 'components/FloatingComponentList'
import SessionItem from 'components/session/SessionItem'


@connectActionSheet
class Sessions extends React.Component<ViewProps & NavigationScreenProps & {
  showActionSheetWithOptions: ShowActionSheetType,
  sessions: Session[],
  openLocationTracking: (checkIn: CheckIn) => void,
  authBasedNewSession: () => void,
} > {

  public state = {
    hideAddButton: false,
  }

  public componentDidMount() {
    this.props.navigation.setParams({ onOptionsPressed: this.onOptionsPressed })
  }

  public onTrackingPress = (checkIn: CheckIn) => () => this.props.openLocationTracking(checkIn)

  public renderAddItem = () => (
    <AddButton
      onPress={this.props.authBasedNewSession}
    >
      {I18n.t('caption_new_session')}
    </AddButton>
  )

  public renderHeader() {
    return <EmptySessionsHeader/>
  }

  public renderItem = ({ item }: any) => {
    return <SessionItem onTrackingPress={this.onTrackingPress(item)} session={item}/>
  }

  public render() {
    return (
      <FloatingComponentList
        data={this.props.sessions}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderItem}
        renderFloatingItem={this.renderAddItem}
      />
    )
  }

  protected onNewSessionPress = () => {
    navigateToNewSession(generateNewSession())
  }

  protected onOptionsPressed = () => {
    this.props.showActionSheetWithOptions(...settingsActionSheetOptions)
  }
}

const mapStateToProps = (state: any) => ({
  sessions: getSessionList(state),
})

export default connect(mapStateToProps, { openLocationTracking, authBasedNewSession })(Sessions)
