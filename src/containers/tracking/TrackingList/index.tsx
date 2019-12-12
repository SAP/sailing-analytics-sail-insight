import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { Text, TouchableOpacity, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import { navigateToQRScanner } from 'navigation'

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
import SessionItemDark from 'components/session/SessionItemDark'
import TextButton from 'components/TextButton'
import { button, container } from 'styles/commons'
import Images from '../../../../assets/Images'
import styles from './styles'


@connectActionSheet
class TrackingList extends React.Component<ViewProps & NavigationScreenProps & {
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

  public renderHeader() {
    return <EmptySessionsHeader/>
  }

  public renderItem = ({ item }: any) => (
      <SessionItemDark
        style={styles.cardsContainer}
        onItemPress={this.onTrackingPress(item)}
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
          <Text style={styles.headLine}>{I18n.t('text_tracking_headline')}</Text>
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

  protected onOptionsPressed = () => {
    this.props.showActionSheetWithOptions(...settingsActionSheetOptions)
  }
}

const mapStateToProps = (state: any) => ({
  sessions: getFilteredSessionList(state),
})

export default connect(mapStateToProps, { selectEvent, startTracking, authBasedNewSession })(TrackingList)
