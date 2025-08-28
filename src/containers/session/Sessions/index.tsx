import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'

import { ActivityIndicator, Image, Text, TouchableOpacity, View,
  ViewProps, Platform, RefreshControl, Alert } from 'react-native'
import { connect } from 'react-redux'
import { isPlatformAndroid } from 'environment'
import * as Screens from 'navigation/Screens'
import { startTracking, StartTrackingAction } from 'actions/tracking'
import { ShowActionSheetType } from 'helpers/types'
import I18n from 'i18n'
import { debounce } from 'lodash'

import { authBasedNewSession } from 'actions/auth'
import { selectEvent } from 'actions/events'
import { fetchEventList } from 'actions/checkIn'
import { Session } from 'models'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { getFilteredSessionList, isSessionListEmpty } from 'selectors/session'
import { getEventIdThatsBeingSelected, isLoadingEventList } from 'selectors/event'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FloatingComponentList from 'components/FloatingComponentList'
import IconText from 'components/IconText'
import ScrollContentView from 'components/ScrollContentView'
import SessionItem from 'components/session/SessionItem'
import SessionItemDark from 'components/session/SessionItemDark'
import TextButton from 'components/TextButton'
import { button, container } from 'styles/commons'
import Images from '../../../../assets/Images'
import createStyles from './styles'

type RootStackParamList = {
  Sessions: {
    forTracking?: boolean;
  };
  QRScanner: undefined;
  SessionDetails?: undefined;
  Tracking?: undefined;
  [key: string]: undefined | object;
};
type NavigationProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

@connectActionSheet
class Sessions extends React.Component<ViewProps & NavigationProps & {
  showActionSheetWithOptions: ShowActionSheetType,
  sessions: Session[],
  startTracking: StartTrackingAction,
  authBasedNewSession: () => void,
  selectEvent: any,
  eventIdThatsBeingSelected?: string,
  isLoggedIn: boolean,
  showHints: boolean,
}, any > {
  private _unsubscribeFromFocus?: () => void;
  private _unsubscribeFromBlur?: () => void;

  swipeableListReferences: { [id: string]: any} = {}
  styles: any

  private debouncedButtonClick = debounce(
    (actionType: string, ...args: any) => {
      this.setState({ swipeableLeftOpenEventId: '' })
      this.closeSwipeableRows()
      switch (actionType) {
        case 'SELECT':
          return this.props.selectEvent(...args)
        case 'CREATE':
          return this.props.authBasedNewSession(...args)
        case 'TRACK':
          console.log('tracking selected')
          if (isPlatformAndroid) {
            return Alert.alert(I18n.t('text_background_tracking_disclosure_title'), I18n.t('text_background_tracking_disclosure_content'),
              [{ text: I18n.t('caption_ok'), onPress: () => this.props.startTracking(...args) }])
          } else {
            return this.props.startTracking(...args)
          }
      }
    },
    1500,
    { leading: true, trailing: false }
  )

  constructor(props: any) {
    super(props)
    this.styles = createStyles(this.props.route?.params?.forTracking)
    this.swipeableListReferences = {};
  }

  public state = {
    hideAddButton: false,
    swipeableLeftOpenEventId: '',
    openedWhenLoading: true,
  }

  public componentDidMount() {
    // when the screen gains focus, snapshot the loading flag into state
    this._unsubscribeFromFocus = this.props.navigation.addListener('focus', () => {
      this.setState({ openedWhenLoading: this.props.isLoadingEventList });
    });
    this._unsubscribeFromBlur = this.props.navigation.addListener('blur', () => {
      this.setState({ swipeableLeftOpenEventId: '' })
      this.closeSwipeableRows()
    })
  }

  public componentWillUnmount() {
    this._unsubscribeFromBlur?.()
    this._unsubscribeFromFocus?.()
  }

  public componentDidUpdate(prevProps: Readonly<any>) {
    if (
        prevProps.isLoadingEventList !== this.props.isLoadingEventList &&
        // RN Navigation adds isFocused() on navigation objects
        (this.props.navigation.isFocused?.() ?? false)
    ) {
      this.setState({ openedWhenLoading: this.props.isLoadingEventList });
    }
  }

  public closeSwipeableRows() {
    Object.keys(this.swipeableListReferences).forEach((key) => {
      this.swipeableListReferences[key]?.close()
    })
  }

  public closeSwipeableRow(previousRow: string, currentRow: string) {
    if (!!previousRow && previousRow !== currentRow) {
      this.swipeableListReferences[previousRow]?.close()
    }
  }

  public renderItem = ({ item }: any) => {
    const { eventIdThatsBeingSelected } = this.props
    const { swipeableLeftOpenEventId } = this.state
    const { eventId } = item
    const isLoading = eventId === eventIdThatsBeingSelected
    const onSwipeableLeftWillOpen = (eventId: string) => {
      this.closeSwipeableRow(swipeableLeftOpenEventId, eventId)
      this.setState({ swipeableLeftOpenEventId: eventId })
    }
    if (!this.props.route?.params?.forTracking) {
      return (
        <SessionItem
          style={this.styles.cardsContainer}
          onItemPress={() => this.debouncedButtonClick('SELECT', { data: item, navigation: this.props.navigation })}
          session={item}
          loading={isLoading}
          swipeableLeftOpenEventId={swipeableLeftOpenEventId}
          onSwipeableLeftWillOpen={onSwipeableLeftWillOpen}
          swipeableReference={(ref: any) => this.swipeableListReferences[item.eventId] = ref}
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
          swipeableReference={(ref: any) => this.swipeableListReferences[item.eventId] = ref}
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
          resizeMode='contain'
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
        <View
          style={this.styles.scrollContainer}
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
                refreshControl={this.props.isLoggedIn ?
                  <RefreshControl
                    refreshing={!shouldShowLoadingSpinner && isLoadingEventList}
                    onRefresh={() => {
                      if (!shouldShowLoadingSpinner) {
                        this.setState({ openedWhenLoading: false });
                        this.props.fetchEventList();
                      }
                    }}
                    tintColor="white"
                  /> :
                  undefined
                }
              />
          }
        </View>
        
          <TextButton
              style={[button.actionFullWidth, container.largeHorizontalMargin, this.styles.qrButton]}
              textStyle={this.styles.qrButtonText}
              onPress={() => this.props.navigation.navigate(Screens.QRScanner)}>
            {I18n.t('caption_qr_scanner').toUpperCase()}
          </TextButton>
        
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
