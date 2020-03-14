import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { Text, TouchableOpacity, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import * as Screens from 'navigation/Screens'
import { startTracking, StartTrackingAction } from 'actions/tracking'
import { ShowActionSheetType } from 'helpers/types'
import I18n from 'i18n'

import { authBasedNewSession } from 'actions/auth'
import { selectEvent } from 'actions/events'
import { Session } from 'models'
import { NavigationScreenProps } from 'react-navigation'
import { getFilteredSessionList } from 'selectors/session'

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

  constructor(props) {
    super(props)
    this.styles = createStyles(this.props.route?.params?.forTracking)
  }

  public state = {
    hideAddButton: false,
  }

  public renderItem = ({ item }: any) => {
    if (!this.props.route?.params?.forTracking) {
      return (
        <SessionItem
          style={this.styles.cardsContainer}
          onItemPress={() => this.props.selectEvent({ data: item, navigation: this.props.navigation })}
          //onItemPress={() => console.log('item select')}
          session={item}
        />
      )
    } else {
      return (
        <SessionItemDark
          style={this.styles.cardsContainer}
          onItemPress={() => this.props.startTracking({ data: item, navigation: this.props.navigation })}
          session={item}
        />
      )
    }
  }

  public render() {
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}>
        <ScrollContentView style={this.styles.scrollContainer}>
          {this.props.route?.params?.forTracking && <Text style={this.styles.headLine}>{I18n.t('text_tracking_headline')}</Text>}
          <TouchableOpacity
            style={this.styles.createButton}
            onPress={() => this.props.authBasedNewSession(this.props.navigation)}>
            <IconText
              source={Images.actions.add}
              iconStyle={this.styles.createButtonIcon}
              textStyle={this.styles.createButtonText}
              iconTintColor="white"
              alignment="horizontal">
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
              onPress={() => this.props.navigation.navigate(Screens.QRScanner)}>
            {I18n.t('caption_qr_scanner').toUpperCase()}
          </TextButton>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state: any) => ({
  sessions: getFilteredSessionList(state),
})

export default connect(mapStateToProps, { selectEvent, startTracking, authBasedNewSession })(Sessions)
