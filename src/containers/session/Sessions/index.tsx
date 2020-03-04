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
import { Session } from 'models'
import { NavigationScreenProps } from 'react-navigation'
import { getFilteredSessionList } from 'selectors/session'

import { SessionsContext } from 'navigation/NavigationContext'
import FloatingComponentList from 'components/FloatingComponentList'
import IconText from 'components/IconText'
import ScrollContentView from 'components/ScrollContentView'
import SessionItem from 'components/session/SessionItem'
import SessionItemDark from 'components/session/SessionItemDark'
import TextButton from 'components/TextButton'
import { button, container } from 'styles/commons'
import Images from '../../../../assets/Images'
import createStyles from './styles'


@connectActionSheet
class Sessions extends React.Component<ViewProps & NavigationScreenProps & {
  showActionSheetWithOptions: ShowActionSheetType,
  sessions: Session[],
  startTracking: StartTrackingAction,
  authBasedNewSession: () => void,
  selectEvent: any,
} > {

  static contextType = SessionsContext

  constructor(props, context) {
    super(props, context)
    this.styles = createStyles(this.context.forTracking)
  }

  public state = {
    hideAddButton: false,
  }

  public componentDidMount() {
    this.props.navigation.setParams({ onOptionsPressed: this.onOptionsPressed })
  }

  public renderItem = ({ item }: any) => {
    if (!this.context.forTracking) {
      return (
        <SessionItem
          style={this.styles.cardsContainer}
          onItemPress={() => this.props.selectEvent(item)}
          session={item}
        />
      )
    } else {
      return (
        <SessionItemDark
          style={this.styles.cardsContainer}
          onItemPress={() => this.props.startTracking(item)}
          session={item}
        />
      )
    }
  }

  public render() {
    const { forTracking } = this.context
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}>
        <ScrollContentView style={this.styles.scrollContainer}>
          {forTracking && <Text style={this.styles.headLine}>{I18n.t('text_tracking_headline')}</Text>}
          <TouchableOpacity
            style={this.styles.createButton}
            onPress={this.props.authBasedNewSession}
          >
            <IconText
              source={Images.actions.add}
              iconStyle={this.styles.createButtonIcon}
              textStyle={this.styles.createButtonText}
              iconTintColor="white"
              alignment="horizontal"
            >
              {I18n.t('session_create_new_event').toUpperCase()}
            </IconText>
          </TouchableOpacity>
          <FloatingComponentList
            style={this.styles.list}
            data={this.props.sessions}
            renderItem={this.renderItem}
          />
        </ScrollContentView>
        <View style={this.styles.bottomButton}>
          <TextButton
              style={[button.actionFullWidth, container.largeHorizontalMargin, this.styles.qrButton]}
              textStyle={this.styles.qrButtonText}
              onPress={() => navigateToQRScanner()}
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

export default connect(mapStateToProps, { selectEvent, startTracking, authBasedNewSession })(Sessions)
