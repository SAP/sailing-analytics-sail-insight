import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { TouchableOpacity, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import { navigateToNewSession, navigateToQRScanner, navigateToSessionDetail } from 'navigation'

import { startTracking, StartTrackingAction } from 'actions/tracking'
import { settingsActionSheetOptions } from 'helpers/actionSheets'
import { ShowActionSheetType } from 'helpers/types'
import I18n from 'i18n'

import { authBasedNewSession } from 'actions/auth'
import { selectEvent } from 'actions/courses'
import { CheckIn, Session } from 'models'
import { NavigationScreenProps } from 'react-navigation'
import { getSessionList } from 'selectors/session'

import AddButton from 'components/AddButton'
import EmptySessionsHeader from 'components/EmptySessionsHeader'
import FloatingComponentList from 'components/FloatingComponentList'
import IconText from 'components/IconText'
import ScrollContentView from 'components/ScrollContentView'
import SessionItem from 'components/session/SessionItem'
import TextButton from 'components/TextButton'
import { button, container } from 'styles/commons'
import Images from '../../../../assets/Images'
import styles from './styles'


@connectActionSheet
class Sessions extends React.Component<ViewProps & NavigationScreenProps & {
  showActionSheetWithOptions: ShowActionSheetType,
  sessions: Session[],
  startTracking: StartTrackingAction,
  authBasedNewSession: () => void,
  selectEvent: any,
} > {

  public state = {
    hideAddButton: false,
  }

  public componentDidMount() {
    this.props.navigation.setParams({ onOptionsPressed: this.onOptionsPressed })
  }

  public onTrackingPress = (checkIn: CheckIn) => () => this.props.startTracking(checkIn)
  public onSessionItemPress = (checkIn: CheckIn) => () => {
    this.props.selectEvent(checkIn.eventId)
    navigateToSessionDetail(checkIn.leaderboardName)
  }

  public renderAddItem = () => (
    <AddButton onPress={this.props.authBasedNewSession}>
      {I18n.t('session_create_new_event').toUpperCase()}
    </AddButton>
  )

  public renderHeader() {
    return <EmptySessionsHeader/>
  }

  public renderItem = ({ item }: any) => (
      <SessionItem
        style={styles.cardsContainer}
        onTrackingPress={this.onTrackingPress(item)}
        onItemPress={this.onSessionItemPress(item)}
        session={item}
      />
  )

  public onQRPress = () => {
    navigateToQRScanner()
  }

  public render() {
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}>
        <ScrollContentView style={styles.scrollContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={this.props.authBasedNewSession}
          >
            <IconText
              source={Images.actions.add}
              iconStyle={styles.createButtonIcon}
              textStyle={styles.createButtonText}
              iconTintColor="white"
              alignment="horizontal"
            >
              {I18n.t('session_create_new_event').toUpperCase()}
            </IconText>
          </TouchableOpacity>
          <FloatingComponentList
            style={styles.list}
            data={this.props.sessions}
            ListHeaderComponent={this.renderHeader}
            renderItem={this.renderItem}
          />
        </ScrollContentView>
        <View style={styles.bottomButton}>
          <TextButton
              style={[button.actionFullWidth, container.largeHorizontalMargin, styles.qrButton]}
              textStyle={styles.qrButtonText}
              onPress={this.onQRPress}
          >
            {I18n.t('caption_qr_scanner').toUpperCase()}
          </TextButton>
        </View>
      </View>
    )
  }

  protected onNewSessionPress = () => navigateToNewSession()

  protected onOptionsPressed = () => {
    this.props.showActionSheetWithOptions(...settingsActionSheetOptions)
  }
}

const mapStateToProps = (state: any) => ({
  sessions: getSessionList(state),
})

export default connect(mapStateToProps, { selectEvent, startTracking, authBasedNewSession })(Sessions)
