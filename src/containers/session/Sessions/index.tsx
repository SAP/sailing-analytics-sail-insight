import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'

import { ActivityIndicator, Image, Text, TouchableOpacity, View, ViewProps, Platform, RefreshControl, ScrollView } from 'react-native'
import { connect } from 'react-redux'

import * as Screens from 'navigation/Screens'
import { startTracking, StartTrackingAction } from 'actions/tracking'
import { ShowActionSheetType } from 'helpers/types'
import I18n from 'i18n'
import { debounce } from 'lodash'

import { authBasedNewSession } from 'actions/auth'
import { selectEvent } from 'actions/events'
import { fetchEventList } from 'actions/checkIn'
import { Session } from 'models'
import { NavigationScreenProps } from 'react-navigation'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { getFilteredSessionList, isSessionListEmpty } from 'selectors/session'
import { getEventIdThatsBeingSelected, isLoadingEventList } from 'selectors/event'

import { NavigationEvents } from '@react-navigation/compat'
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
  eventIdThatsBeingSelected?: string,
  isLoggedIn: boolean,
  showHints: boolean,
} > {
  private debouncedButtonClick = debounce(
    (actionType: string, ...args: any) => {
      this.setState({ swipeableLeftOpenEventId: '' })
      switch (actionType) {
        case 'SELECT':
          return this.props.selectEvent(...args)
        case 'CREATE':
          return this.props.authBasedNewSession(...args)
        case 'TRACK':
          return this.props.startTracking(...args)
      }
    },
    1500,
    { leading: true, trailing: false }
  )

  constructor(props) {
    super(props)
    this.styles = createStyles(this.props.route?.params?.forTracking)
  }

  public state = {
    hideAddButton: false,
    swipeableLeftOpenEventId: '',
    openedWhenLoading: true,
  }

  public componentDidMount() {
    this._unsubscribeFromBlur = this.props.navigation.addListener('blur', () => {
      this.setState({ swipeableLeftOpenEventId: '' })
    })
  }

  public componentWillUnmount() {
    this._unsubscribeFromBlur()
  }

  public renderItem = ({ item }: any) => {
    const { eventIdThatsBeingSelected } = this.props
    const { swipeableLeftOpenEventId } = this.state
    const { eventId } = item
    const isLoading = eventId === eventIdThatsBeingSelected
    const onSwipeableLeftWillOpen = eventId => this.setState({ swipeableLeftOpenEventId: eventId })
    if (!this.props.route?.params?.forTracking) {
      return (
        <SessionItem
          style={this.styles.cardsContainer}
          onItemPress={() => this.debouncedButtonClick('SELECT', { data: item, navigation: this.props.navigation })}
          session={item}
          loading={isLoading}
          swipeableLeftOpenEventId={swipeableLeftOpenEventId}
          onSwipeableLeftWillOpen={onSwipeableLeftWillOpen}
        />
      )
    } else {
      return (
        <SessionItemDark
          style={this.styles.cardsContainer}
          onItemPress={() => this.debouncedButtonClick('TRACK', { data: item, navigation: this.props.navigation })}
          session={item}
          swipeableLeftOpenEventId={swipeableLeftOpenEventId}
          onSwipeableLeftWillOpen={onSwipeableLeftWillOpen}
        />
      )
    }
  }

  public renderHint = () => {
    return (
      <View style={this.styles.hintContainer}>
        <Image
          source={
            I18n.locale.substring(0, 3) === 'de-'
              ? Images.defaults.background_empty_de
              : Images.defaults.background_empty
          }
          style={this.styles.hintBackgroundImage}
        />
      </View>
    )
  }

  public render() {
    const { openedWhenLoading } = this.state
    const { isLoadingEventList, showHints } = this.props

    const shouldShowLoadingSpinner = openedWhenLoading && isLoadingEventList
    return (
      <View style={this.styles.container}>
        <NavigationEvents
          onWillFocus={() => this.setState({ openedWhenLoading: isLoadingEventList })}
        />
        <ScrollView
          style={this.styles.scrollContainer}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={this.props.isLoggedIn &&
            <RefreshControl
              refreshing={!shouldShowLoadingSpinner && isLoadingEventList}
              onRefresh={() => {
                if (!shouldShowLoadingSpinner) {
                  this.setState({ openedWhenLoading: false });
                  this.props.fetchEventList();
                }
              }}
              tintColor="white"
            />
          }
        >
          {this.props.route?.params?.forTracking && <Text style={this.styles.headLine}>{I18n.t('text_tracking_headline')}</Text>}
          <TouchableOpacity
            style={this.styles.createButton}
            onPress={() => this.debouncedButtonClick('CREATE', this.props.navigation)}>
            <IconText
              source={Images.actions.add}
              iconStyle={this.styles.createButtonIcon}
              textStyle={this.styles.createButtonText}
              iconTintColor="white"
              alignment="horizontal">
              {I18n.t('session_create_new_event').toUpperCase()}
            </IconText>
          </TouchableOpacity>
          {shouldShowLoadingSpinner
            ? <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="white" />
              </View>
            : showHints ? this.renderHint() :<FloatingComponentList
                style={this.styles.list}
                data={this.props.sessions}
                renderItem={this.renderItem}
                extraData={this.state.swipeableLeftOpenEventId}
              />
          }
        </ScrollView>
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

const mapStateToProps = (state: any, props: any) => {
  const sessions = getFilteredSessionList(props.route?.params?.forTracking)(state)
  return ({
    sessions,
    showHints: isSessionListEmpty(props.route?.params?.forTracking)(state),
    isLoggedIn: isLoggedInSelector(state),
    eventIdThatsBeingSelected: getEventIdThatsBeingSelected(state),
    isLoadingEventList: isLoadingEventList(state)
  })
}

export default connect(mapStateToProps, { fetchEventList, selectEvent, startTracking, authBasedNewSession })(Sessions)
