import React, { Component as ReactComponent } from 'react'
import { Text, Platform } from 'react-native'
import { connect } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import SpinnerOverlay from 'react-native-loading-spinner-overlay'
import ScreenOrientation, { PORTRAIT, LANDSCAPE } from 'react-native-orientation-locker/ScreenOrientation'

import { compose, reduce, concat, mergeDeepLeft, merge,
  includes, once, when, always, reject, isNil } from 'ramda'

// Store
import 'store/init'

// Selectors
import { getFormTeamName } from 'selectors/boat'

// Components
import GradientNavigationBar from 'components/GradientNavigationBar'
import ModalBackButton from 'components/ModalBackButton'

// Navigation?
import * as Screens from 'navigation/Screens'
import { AuthContext } from 'navigation/NavigationContext'

// Actions
import { initializeApp } from 'actions/appLoading'
import { performDeepLink } from 'actions/deepLinking'
import { handleLocation, initLocationUpdates } from 'actions/locations'
import { updateTrackingStatus } from 'actions/locationTrackingData'

// Selectors
import { getLocationTrackingStatus } from 'selectors/location'
import { areThereActiveCheckIns, isLoadingCheckIn, isBoundToMark } from 'selectors/checkIn'
import { getSelectedMarkProperties } from 'selectors/course'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { hasMarkProperties } from 'selectors/inventory'

// Components
import { stackScreen, stackNavigator, tabsScreen, tabsNavigator } from 'components/fp/navigation'
import { Component, fold, nothing, recomposeBranch as branch } from 'components/fp/component'
import HeaderBackButton from 'components/HeaderBackButton'
import HeaderTitle from 'components/HeaderTitle'
import IconText from 'components/IconText'
import ImageButton from 'components/ImageButton'
import TextButton from 'components/TextButton'
import WebView from 'components/WebView'

// Containers (Also components, but more like pages, single-use)
import AccountList from 'containers/user/AccountList'
import AppSettings from 'containers/AppSettings'
import CommunicationsSettings from 'containers/CommunicationsSettings'
import EditCompetitor from 'containers/session/EditCompetitor'
import EventCreation from 'containers/session/EventCreation'
import ExpertSettings from 'containers/ExpertSettings'
import FirstContact from 'containers/user/FirstContact'
import Geolocation from 'containers/CourseCreation/Geolocation'
import JoinRegatta, { JoinRegattaActionType } from 'containers/session/JoinRegatta'
import Leaderboard from 'containers/session/Leaderboard/Leaderboard'
import Login from 'containers/authentication/Login'
import MarkInventory from 'containers/Inventory/MarkInventory'
import MarkTracking from 'containers/tracking/MarkTracking'
import PasswordReset from 'containers/authentication/PasswordReset'
import QRScanner from 'containers/session/QRScanner'
import RaceCourseLayout from 'containers/CourseCreation/RaceCourseLayout'
import RaceDetails from 'containers/CourseCreation/RaceDetails'
import RegisterBoat from 'containers/authentication/RegisterBoat'
import RegisterCredentials from 'containers/authentication/RegisterCredentials'
import SessionDetail from 'containers/session/SessionDetail'
import SessionDetail4Organizer from 'containers/session/SessionDetail4Organizer'
import Sessions from 'containers/session/Sessions'
import SetWind from 'containers/tracking/SetWind'
import Support from 'containers/Support'
import TeamDetails from 'containers/TeamDetails'
import TeamList from 'containers/user/TeamList'
import TrackerBinding from 'containers/CourseCreation/TrackerBinding'
import Tracking from 'containers/tracking/Tracking'
import UserProfile from 'containers/user/UserProfile'
import WelcomeTracking from 'containers/tracking/WelcomeTracking'
import ZendeskSupport from 'containers/ZendeskSupport'
import { ShareButton } from 'containers/session/common'

// Styling & Images
import Images from '@assets/Images'
import { button, tab, navigation as navigationStyles } from 'styles/commons'
import { $headerTintColor, $primaryTextColor, $secondaryTextColor, $siWhite, $siDarkBlue, $siDarkerBlue, $siTransparent } from 'styles/colors'

// Logging
import Logger from 'helpers/Logger'

// Internationalisation
import I18n from 'i18n'
import { getTabItemTitleTranslation } from 'helpers/texts'

// Deep Linking
import * as DeepLinking from 'integrations/DeepLinking'

// Location Service
import * as LocationService from 'services/LocationService'

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const stackNavigatorConfig = {
  mode: 'card',
  headerMode: 'screen',
}

const screenWithHeaderOptions = {
  headerTitleStyle: navigationStyles.heading,
  headerTintColor: $siWhite,
  headerStyle: {
    backgroundColor: $siDarkBlue,
    borderBottomWidth: 0,
    elevation: 0,
    shadowColor: $siDarkerBlue
  },
  headerTitleAlign: 'center'
}

const navHeaderTransparentProps = {
  headerTransparent: true,
  headerStyle: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    elevation: 0
  }
}

const getTabBarIcon = (route: any, tintColor: any, focused: any) => {
  const { name = '' } = route
  let icon
  switch (name) {
    case Screens.TrackingNavigator:
      icon = Images.tabs.tracking
      break
    case Screens.SessionsNavigator:
      icon = Images.tabs.sessions
      break
    case Screens.CheckIn:
      icon = Images.tabs.join
      break
    case Screens.Account:
      icon = Images.tabs.account
      break
    case Screens.Inventory:
      icon = Images.tabs.inventory
      break
  }

  const iconTintColor = focused ? 'white' : 'gray'
  const focusStyle = focused ? { fontWeight: 'bold' } : undefined

  return <IconText
      style={{marginTop: 6}}
      iconStyle={[tab.tabItemIcon, { tintColor: iconTintColor }]}
      textStyle={[tab.bottomTabItemText, { color: tintColor }, focusStyle]}
      source={icon}
      iconTintColor={iconTintColor}
      iconPosition="first"
      iconOnly={false}/>
}

const getTabBarLabel = (route: any, color: any, focused: any) => {
  const { name = '' } = route
  const tintColor = color
  const focusStyle = focused ? { fontWeight: 'bold' } : undefined

  return (
    <Text style={[tab.bottomTabItemText, {color: tintColor, marginBottom: 3}, focusStyle ]}>{getTabItemTitleTranslation(name)}</Text>
  )
}

const teamDeleteHeader = (route: any) => (route?.params?.paramTeamName) && (
  <ImageButton
    source={Images.actions.delete}
    style={button.actionIconNavBar}
    imageStyle={{ tintColor: 'white' }}
    onPress={route.params?.onOptionsPressed}
  />)

const TeamDetailsHeader = connect(
  (state: any) => ({ text: getFormTeamName(state) }))(
  (props: any) => <HeaderTitle firstLine={props.text || I18n.t('title_your_team')} />)

const MarkLocationHeader = connect(
  (state: any) => {
    const markProps: any = getSelectedMarkProperties(state)

    return { markName: `(${markProps.shortName}) ${markProps.name}` }
  })(
  (props: any) => <HeaderTitle firstLine={props.markName}/>)

const navigationContainer = React.createRef()


// ----------------------------------------------------------------------------
// Navigation Modifiers -------------------------------------------------------
// ----------------------------------------------------------------------------

const withoutHeader = mergeDeepLeft({ options: { headerShown: false } })
const withoutTitle = mergeDeepLeft({ options: { title: '' }})
const withoutHeaderTitle = mergeDeepLeft({ options: { headerTitle: () => null }})
const withoutHeaderLeft = mergeDeepLeft({ options: { headerLeft: () => null } })
const withTransparentHeader = mergeDeepLeft({ options: { ...navHeaderTransparentProps } })
const withGradientHeaderBackground = mergeDeepLeft({ options: { headerBackground: (props: any) => <GradientNavigationBar transparent="true" {...props} /> } })
const withRightModalBackButton = mergeDeepLeft({ options: { headerRight: () => <ModalBackButton type="icon" iconColor={$headerTintColor} /> } })

// Left header back button (Chevron only)
const withLeftHeaderBackButton = (options) => mergeDeepLeft({
  options: {
    headerLeft: HeaderBackButton({
      labelVisible: false,
      onPress: when(always(options.backOnceClickable), once)(() => navigationContainer.current.goBack())
    })
  }
})(options)

// Left header close button (X only)
const withLeftHeaderCloseButton = (options) => mergeDeepLeft({
  options: {
    headerLeft: () => <ModalBackButton type="icon" iconColor={$headerTintColor} />
  },
})(options)

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const markTrackingNavigator = Component(props => compose(
  fold(props),
  stackNavigator({ initialRouteName: Screens.MarkTracking, ...stackNavigatorConfig, screenOptions: screenWithHeaderOptions }),
  reduce(concat, nothing()))([
  stackScreen(withoutHeader({ name: Screens.MarkTracking, component: MarkTracking.fold })),
]))

const trackingNavigator = Component(props => compose(
  fold(props),
  stackNavigator({
    initialRouteName: props.locationTrackingStatus === LocationService.LocationTrackingStatus.RUNNING ? Screens.Tracking : Screens.WelcomeTracking,
    ...stackNavigatorConfig,
    screenOptions: screenWithHeaderOptions }),
  reduce(concat, nothing()))([
  stackScreen(withoutHeader({ name: Screens.WelcomeTracking, component: WelcomeTracking })),
  stackScreen(compose(withTransparentHeader, withGradientHeaderBackground,
    withRightModalBackButton, withoutHeaderLeft, withoutTitle)(
    { name: Screens.TrackingList, component: Sessions, initialParams: { forTracking: true } })),
  stackScreen(withoutHeaderLeft({ name: Screens.Tracking, component: Tracking, options: { title: I18n.t('title_tracking'), gestureEnabled: false } })),
  stackScreen({ name: Screens.SetWind, component: SetWind, options: { title: I18n.t('title_set_wind') } }),
  stackScreen(withLeftHeaderBackButton({ name: Screens.Leaderboard, component: Leaderboard, options: { title: I18n.t('title_leaderboard') }, backOnceClickable: true })),
]))

const TrackingSwitch = connect((state: any) => ({
    boundToMark: isBoundToMark(state),
    locationTrackingStatus: getLocationTrackingStatus(state)
}))(props => {
  return props.boundToMark
    ? markTrackingNavigator.fold(props)
    : trackingNavigator.fold(props)
})

const sessionsNavigator = Component(props => compose(
  fold(props),
  stackNavigator({ initialRouteName: Screens.Sessions, ...stackNavigatorConfig, screenOptions: screenWithHeaderOptions }),
  reduce(concat, nothing()))([
  stackScreen(withoutHeader({ name: Screens.Sessions, component: Sessions })),
  stackScreen(withLeftHeaderBackButton({ name: Screens.EventCreation, component: EventCreation.fold, options: { title: I18n.t('title_event_creation') } })),
  stackScreen(withLeftHeaderBackButton({ name: Screens.SessionDetail4Organizer, component: SessionDetail4Organizer.fold,
    options: { title: I18n.t('title_event_details'), headerRight: () => ShareButton.fold({}) } })),
  stackScreen(withLeftHeaderBackButton({ name: Screens.SessionDetail, component: SessionDetail.fold,
    options: { title: I18n.t('title_event_details'), headerRight: () => ShareButton.fold({}) } })),
  stackScreen(withLeftHeaderBackButton({ name: Screens.RaceDetails, component: RaceDetails.fold,
    options: { title: I18n.t('title_race_details') } })),
  stackScreen(withLeftHeaderBackButton({ name: Screens.TrackDetails, component: WebView,
    options: { title: I18n.t('caption_sap_analytics_header') } })),
  stackScreen(withLeftHeaderBackButton({ name: Screens.RaceCourseLayout, component: RaceCourseLayout.fold,
    options: { title: I18n.t('title_race_course'), gestureEnabled: false } })),
  stackScreen(withLeftHeaderBackButton({ name: Screens.CourseGeolocation,
    component: Geolocation.contramap((props: any) => ({
      ...props,
      selectedMarkConfiguration: props.route.params.data.selectedMarkConfiguration,
      currentPosition: props.route.params.data.currentPosition,
      markPosition: props.route.params.data.markPosition })).fold,
    options: { headerTitle: () => <MarkLocationHeader/> } })),
  stackScreen(withLeftHeaderBackButton({ name: Screens.CourseTrackerBinding,
    component: TrackerBinding.contramap((props: any) => ({
      ...props,
      selectedMarkConfiguration: props.route.params.data.selectedMarkConfiguration,
    })).fold,
    options: { title: I18n.t('caption_course_creator_bind_with_tracker') } })),
    stackScreen(withLeftHeaderBackButton({ name: Screens.EditCompetitor, component: EditCompetitor.fold,
      options: { title: I18n.t('title_edit_competitor') } }))
]))

const accountNavigator = Component(props => compose(
  fold(props),
  stackNavigator({ initialRouteName: Screens.AccountList, ...stackNavigatorConfig, screenOptions: screenWithHeaderOptions }),
  reduce(concat, nothing()))([
  stackScreen(withoutHeader({ name: Screens.AccountList, component: AccountList })),
  stackScreen(compose(withLeftHeaderBackButton)({ name: Screens.UserProfile, component: UserProfile, options: { title: I18n.t('title_your_account') } })),
  stackScreen(compose(withLeftHeaderBackButton)({ name: Screens.TeamList, component: TeamList, options: { title: I18n.t('caption_tab_teamlist') } })),
  stackScreen(compose(withLeftHeaderBackButton)({ name: Screens.AppSettings, component: AppSettings, options: { title: I18n.t('caption_tab_appsettings') } })),
  stackScreen(compose(withLeftHeaderBackButton)({ name: Screens.Communications, component: CommunicationsSettings, options: { title: I18n.t('caption_tab_communicationssettings') } })),
  stackScreen(compose(withLeftHeaderBackButton)({ name: Screens.Support, component: Support.fold, options: { title: I18n.t('caption_tab_support') } })),
  stackScreen(compose(withRightModalBackButton, withoutHeaderLeft)({ name: Screens.ExpertSettings, component: ExpertSettings, options: { title: I18n.t('title_expert_settings') } })),
  stackScreen({ name: Screens.ZendeskSupport, component: ZendeskSupport, options: ({ route }) => ({
    headerLeft: HeaderBackButton({ onPress: () => navigationContainer.current.goBack() }),
    title: route?.params?.data?.supportType === 'FAQ' ? I18n.t('caption_faq') : I18n.t('caption_known_issues')
  }) }),
  stackScreen(({
    name: Screens.TeamDetails,
    component: TeamDetails,
    options: ({ route }) => ({
      headerLeft: HeaderBackButton({ onPress: () => navigationContainer.current.goBack() }),
      headerTitle: () => <TeamDetailsHeader/>,
      headerRight: () => teamDeleteHeader(route),
    })
  })),
]))

const preventTabPressBackAction = (navigatorScreen, toPrevent, toGoBack) => (props: any) => {
  const { navigation, route, preventDefault } = props
  const selectedTab = route.state?.routes[route.state?.index]

  if (selectedTab && selectedTab.name === navigatorScreen) {
    const selectedTrackingStack = selectedTab.state?.routes[selectedTab.state?.index].name

    if (includes(selectedTrackingStack, toPrevent))
      preventDefault()
    if (includes(selectedTrackingStack, toGoBack))
      navigation.goBack()
  }
}

const trackingTabPress = preventTabPressBackAction(
  Screens.TrackingNavigator,
  [Screens.Tracking, Screens.SetWind, Screens.Leaderboard],
  [Screens.SetWind, Screens.Leaderboard]
)

const eventTabPress  = preventTabPressBackAction(
  Screens.SessionsNavigator,
  [Screens.RaceCourseLayout],
  []
)

const mainTabsNavigator = Component(props => compose(
  fold(props),
  tabsNavigator({
    initialRouteName: Screens.TrackingNavigator,
    lazy: false,
    backBehavior: 'initialRoute',
    tabBarOptions: {
      activeTintColor: $primaryTextColor,
      inactiveTintColor: $secondaryTextColor,
      style: tab.bottomTabBar,
      showLabel: true,
      showIcon: true,
      keyboardHidesTabBar: (Platform.OS === 'android') ? true : false,
    },
    screenOptions: ({ route }) => ({
      tabBarIcon: ({ color, focused }) => getTabBarIcon(route, color, focused),
      tabBarLabel: ({ color, focused }) => getTabBarLabel(route, color, focused),
    }),
  }),
  reduce(concat, nothing()),
  reject(isNil))([
  tabsScreen({ name: Screens.TrackingNavigator, component: TrackingSwitch, listeners: { tabPress: event => trackingTabPress(merge(props, event)) } }),
  tabsScreen({ name: Screens.SessionsNavigator, component: sessionsNavigator.fold, listeners: { tabPress: event => eventTabPress(merge(props, event)) } }),
  // Recompose branch utility cannot be used here since react-navigation expects
  // direct children for a navigator to be Screen components.
  props.userHasMarkProperties ? tabsScreen({ name: Screens.Inventory, component: MarkInventory.fold }) : null,
  tabsScreen({ name: Screens.Account, component: accountNavigator.fold }),
]))

const joinRegattaScreenMixins = compose(withLeftHeaderCloseButton, withTransparentHeader, withoutTitle)

const AppNavigator = Component(props => compose(
  fold(props),
  stackNavigator({
    initialRouteName: props.shouldShowFirstContact ? Screens.FirstContact: Screens.Main,
    ...stackNavigatorConfig,
    screenOptions: screenWithHeaderOptions
  }),
  reduce(concat, nothing())
)([
  stackScreen(withoutHeader({ name: Screens.FirstContact, component: FirstContact })),
  stackScreen(joinRegattaScreenMixins({
    name: Screens.JoinRegatta, component: JoinRegatta, initialParams: { actionType: JoinRegattaActionType.JoinEvent }
  })),
  stackScreen(joinRegattaScreenMixins({
    name: Screens.JoinRegattaForTracking, component: JoinRegatta, initialParams: { actionType: JoinRegattaActionType.Track }
  })),
  stackScreen(joinRegattaScreenMixins({
    name: Screens.JoinRegattaAsCompetitor, component: JoinRegatta, initialParams: { actionType: JoinRegattaActionType.JoinAsCompetitor }
  })),
  stackScreen(compose(withTransparentHeader, withoutTitle, withoutHeaderLeft)({
    name: Screens.RegisterBoatAfterRegistration, component: RegisterBoat,
    options: {
      headerRight: () => <TextButton textStyle={button.headerTextButton} onPress={() => navigationContainer.current.navigate(Screens.Main)}>{I18n.t('caption_skip')}</TextButton>
    }
  })),
  stackScreen(compose(withLeftHeaderBackButton, withTransparentHeader, withoutTitle)({
    name: Screens.RegisterBoat, component: RegisterBoat
  })),
  stackScreen(withoutHeader({
    name: Screens.Main,
    component: mainTabsNavigator.contramap(merge({ userHasMarkProperties: props.userHasMarkProperties })).fold
  })),
  stackScreen(compose(withLeftHeaderCloseButton, withTransparentHeader, withGradientHeaderBackground, withoutTitle)({
    name: Screens.QRScanner, component: QRScanner
  })),
  stackScreen(compose(withLeftHeaderBackButton, withTransparentHeader, withoutTitle)({
    name: Screens.LoginFromSplash, component: Login
  })),
  stackScreen(compose(withTransparentHeader, withoutHeaderTitle, withLeftHeaderBackButton)({
    name: Screens.Login, component: Login
  })),
  stackScreen(compose(withTransparentHeader, withoutHeaderTitle, withLeftHeaderBackButton)({
    name: Screens.RegisterCredentials, component: RegisterCredentials
  })),
  stackScreen(compose(withoutTitle, withTransparentHeader, withGradientHeaderBackground, withLeftHeaderBackButton)({
    name: Screens.PasswordReset, component: PasswordReset
  })),
  stackScreen(withLeftHeaderBackButton({ name: Screens.EditResults,
    component: props => [
      <WebView {...props}/>,
      Platform.select({
        android: <ScreenOrientation orientation={LANDSCAPE}/>,
        ios: null })],
    options: { title: I18n.t('caption_sap_analytics_header') } }))
]))

class AppRoot extends ReactComponent {
  public deepLinkSubscriber: any

  public componentDidMount() {
    this.initDeepLinks()
    DeepLinking.addListener(this.handleDeeplink)
    LocationService.addStatusListener(this.handleLocationTrackingStatus)
    LocationService.addLocationListener(this.handleGeolocation)
    LocationService.registerEvents()

    this.props.initializeApp(navigationContainer.current)
  }

  public componentWillUnmount() {
    DeepLinking.removeListener(this.handleDeeplink)
    this.finalizeDeepLinks()
    LocationService.removeStatusListener(this.handleLocationTrackingStatus)
    LocationService.removeLocationListener(this.handleGeolocation)
    LocationService.unregisterEvents()
  }

  public render() {
    const { isLoggedIn,isLoadingCheckIn } = this.props
    return (
      <ActionSheetProvider>
        <AuthContext.Provider value = {{ isLoggedIn }}>
          <NavigationContainer ref={navigationContainer}>
            <ScreenOrientation orientation={PORTRAIT}/>
            { AppNavigator.fold(this.props) }
            <SpinnerOverlay visible={isLoadingCheckIn} cancelable={false}/>
          </NavigationContainer>
        </AuthContext.Provider>
      </ActionSheetProvider>
    )
  }

  protected initDeepLinks = () => {
    this.deepLinkSubscriber = DeepLinking.initialize()
  }

  protected finalizeDeepLinks = () => {
    if (!this.deepLinkSubscriber) {
      return
    }
    this.deepLinkSubscriber()
    this.deepLinkSubscriber = null
  }

  protected handleDeeplink = (params: any) => {
    this.props.performDeepLink(params, navigationContainer.current)
  }

  protected handleLocationTrackingStatus = (enabled: boolean) => {
    const status = enabled ?
    LocationService.LocationTrackingStatus.RUNNING :
    LocationService.LocationTrackingStatus.STOPPED
    this.props.updateTrackingStatus(status)
  }

  protected handleGeolocation = async (location: any) => {
    try {
      await this.props.handleLocation(location)
    } catch (err) {
      if (!err) {
        return
      }
      Logger.debug(err.message, err.data)
    }
  }
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedInSelector(state),
  isLoadingCheckIn: isLoadingCheckIn(state),
  shouldShowFirstContact: !isLoggedInSelector(state) && !areThereActiveCheckIns(state),
  userHasMarkProperties: hasMarkProperties(state)
})

export default connect(
  mapStateToProps,
  { performDeepLink, updateTrackingStatus, handleLocation,
  initLocationUpdates, initializeApp })(
  AppRoot)
