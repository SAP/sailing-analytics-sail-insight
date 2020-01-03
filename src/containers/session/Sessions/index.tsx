import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { TouchableOpacity, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import { navigateToQRScanner, navigateToSessionDetail } from 'navigation'

import { startTracking, StartTrackingAction } from 'actions/tracking'
import { settingsActionSheetOptions } from 'helpers/actionSheets'
import { ShowActionSheetType } from 'helpers/types'
import I18n from 'i18n'

import { authBasedNewSession } from 'actions/auth'
import { selectEvent } from 'actions/events'
import { CheckIn, Session } from 'models'
import { NavigationScreenProps } from 'react-navigation'
import { getFilteredSessionList } from 'selectors/session'

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

  public renderHeader() {
    return <EmptySessionsHeader/>
  }

  public renderItem = ({ item }: any) =>
    <SessionItem
      style={styles.cardsContainer}
      onItemPress={() => this.props.selectEvent(item)}
      session={item}/>

  public render() {
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}>
        <ScrollContentView style={styles.scrollContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={this.props.authBasedNewSession}>
            <IconText
              source={Images.actions.add}
              iconStyle={styles.createButtonIcon}
              textStyle={styles.createButtonText}
              iconTintColor="white"
              alignment="horizontal">
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
              onPress={() => navigateToQRScanner()}>
            {I18n.t('caption_qr_scanner').toUpperCase()}
          </TextButton>
        </View>
      </View>
    )
  }

  protected onOptionsPressed = () => {
    this.props.showActionSheetWithOptions(...settingsActionSheetOptions)
  }
}

const mapStateToProps = (state: any) => ({
  sessions: getFilteredSessionList(state),
})

export default connect(mapStateToProps, { selectEvent, startTracking, authBasedNewSession })(Sessions)
