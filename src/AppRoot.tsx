import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import React, { Component as ReactComponent } from 'react'
import { connect } from 'react-redux'
import { compose, reduce, concat, mergeDeepLeft, merge, includes, propEq } from 'ramda'
import { Text } from 'react-native'
import 'store/init'

import GradientNavigationBar from 'components/GradientNavigationBar'
import ModalBackButton from 'components/ModalBackButton'
import SplashScreen from 'containers/SplashScreen'
import * as Screens from 'navigation/Screens'
import Images from '@assets/Images'
import Logger from 'helpers/Logger'
import SpinnerOverlay from 'react-native-loading-spinner-overlay'
import * as DeepLinking from 'integrations/DeepLinking'
import * as LocationService from 'services/LocationService'
import { initializeApp } from 'actions/appLoading'
import { performDeepLink } from 'actions/deepLinking'
import { handleLocation, initLocationUpdates } from 'actions/locations'
import { updateTrackingStatus } from 'actions/locationTrackingData'
import * as GpsFixService from './services/GPSFixService'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { isLoadingCheckIn, isBoundToMark } from 'selectors/checkIn'
import { NavigationContainer } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import { AuthContext } from 'navigation/NavigationContext'
import { stackScreen, stackNavigator, tabsScreen, tabsNavigator } from 'components/fp/navigation'
import { Component, fold, nothing, reduxConnect, recomposeBranch as branch, nothingAsClass, fromClass } from 'components/fp/component'
import { view, text } from 'components/fp/react-native'
import FirstContact from 'containers/user/FirstContact'
import Sessions from 'containers/session/Sessions'
import QRScanner from 'containers/session/QRScanner'
import JoinRegatta from 'containers/session/JoinRegatta'
import EditCompetitor from 'containers/session/EditCompetitor'
import TeamDetails from 'containers/TeamDetails'
import Login from 'containers/authentication/Login'
import RegisterCredentials from 'containers/authentication/RegisterCredentials'
import PasswordReset from 'containers/authentication/PasswordReset'
import MarkInventory from 'containers/Inventory/MarkInventory'
import AppSettings from 'containers/AppSettings'
import { getSelectedMarkProperties } from 'selectors/course'
import AccountList from 'containers/user/AccountList'
import TrackerBinding from 'containers/CourseCreation/TrackerBinding'
import Geolocation from 'containers/CourseCreation/Geolocation'
import TeamList from 'containers/user/TeamList'
import EventCreation from 'containers/session/EventCreation'
import ExpertSettings from 'containers/ExpertSettings'
import Leaderboard from 'containers/session/Leaderboard/Leaderboard'
import SetWind from 'containers/tracking/SetWind'
import Tracking from 'containers/tracking/Tracking'
import MarkTracking from 'containers/tracking/MarkTracking'
import WelcomeTracking from 'containers/tracking/WelcomeTracking'
import RaceDetails from 'containers/CourseCreation/RaceDetails'
import HeaderTitle from 'components/HeaderTitle'
import RaceCourseLayout from 'containers/CourseCreation/RaceCourseLayout'
import { getFormTeamName } from 'selectors/boat'
import RegisterBoat from 'containers/authentication/RegisterBoat'
import UserProfile from 'containers/user/UserProfile'
import ImageButton from 'components/ImageButton'
import WebView from 'components/WebView'
import SessionDetail4Organizer from 'containers/session/SessionDetail4Organizer'
import SessionDetail, { ShareButton } from 'containers/session/SessionDetail'
import I18n from 'i18n'
import { $headerTintColor, $primaryTextColor, $secondaryTextColor, $primaryBackgroundColor } from 'styles/colors'
import { getTabItemTitleTranslation } from 'helpers/texts'
import IconText from 'components/IconText'
import { tab, navigation as navigationStyles } from 'styles/commons'

const stackNavigatorConfig = {
  mode: 'card',
  headerMode: 'screen',
}

const screenWithHeaderOptions = {
  headerTitleStyle: navigationStyles.headerTitle,
  headerTintColor: $headerTintColor,
  headerStyle: {
    backgroundColor: $primaryBackgroundColor,
  },
  headerTitleAlign: 'center',
}

const navHeaderTransparentProps = {
  headerTransparent: true,
  headerStyle: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    elevation: 0,
  },
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

const teamDeleteHeader = (route: any) => (route.params.paramTeamName) && (
  <ImageButton
    source={Images.actions.delete}
    style={button.actionIconNavBar}
    imageStyle={{ tintColor: 'white' }}
    onPress={route.params?.onOptionsPressed}
  />)

const TeamDetailsHeader = connect(
  (state: any) => ({ text: getFormTeamName(state) }))(
  (props: any) => <HeaderTitle firstLine={props.text || I18n.t('title_your_team')}/>)

const MarkLocationHeader = connect(
  (state: any) => {
    const markProps: any = getSelectedMarkProperties(state)

    return { markName: `(${markProps.shortName}) ${markProps.name}` }
  })(
  (props: any) => <HeaderTitle firstLine={props.markName}/>)

const navigationContainer = React.createRef()

const withoutHeader = mergeDeepLeft({ options: { headerShown: false } })
const withoutTitle = mergeDeepLeft({ options: { title: '' }})
const withoutHeaderTitle = mergeDeepLeft({ options: { headerTitle: () => null }})
const withoutHeaderLeft = mergeDeepLeft({ options: { headerLeft: () => null } })
const withTransparentHeader = mergeDeepLeft({ options: { ...navHeaderTransparentProps } })
const withGradientHeaderBackground = mergeDeepLeft({ options: { headerBackground: (props: any) => <GradientNavigationBar transparent="true" {...props} /> } })
const withRightModalBackButton = mergeDeepLeft({ options: { headerRight: () => <ModalBackButton type="icon" iconColor={$headerTintColor} /> } })
const withLeftHeaderBackButton = mergeDeepLeft({ options: {
  headerLeft: () => <HeaderBackButton onPress={() => navigationContainer.current.goBack()} tintColor="white"	labelVisible={false} />}})

const nothingWhenBoundToMark = branch(propEq('boundToMark', true), nothingAsClass)
const nothingWhenNotBoundToMark = branch(propEq('boundToMark', false), nothingAsClass)

const markTrackingNavigator = Component(props => compose(
  fold(props),
  stackNavigator({ initialRouteName: Screens.MarkTracking, ...stackNavigatorConfig, screenOptions: screenWithHeaderOptions }),
  reduce(concat, nothing()))([
  stackScreen(withoutHeader({ name: Screens.MarkTracking, component: MarkTracking.fold })),
]))

const trackingNavigator = Component(props => compose(
  fold(props),
  stackNavigator({ initialRouteName: Screens.WelcomeTracking, ...stackNavigatorConfig, screenOptions: screenWithHeaderOptions }),
  reduce(concat, nothing()))([
  stackScreen(withoutHeader({ name: Screens.WelcomeTracking, component: WelcomeTracking })),
  stackScreen(compose(withTransparentHeader, withGradientHeaderBackground,
    withRightModalBackButton, withoutHeaderLeft, withoutTitle)(
    { name: Screens.TrackingList, component: Sessions, initialParams: { forTracking: true } })),
  stackScreen(withoutHeaderLeft({ name: Screens.Tracking, component: Tracking, options: { title: I18n.t('title_tracking') } })),
  stackScreen({ name: Screens.SetWind, component: SetWind, options: { title: I18n.t('title_set_wind') } }),
  stackScreen(withLeftHeaderBackButton({ name: Screens.Leaderboard, component: Leaderboard, options: { title: I18n.t('title_leaderboard') } })),
]))

// const TrackingSwitch = Component((props: any) => compose(
//   fold(props),
//   reduxConnect((state: any) => {
//     return {
//       boundToMark: isBoundToMark(state)
//     }
//   }),
//   view({ style: { flex: 1 } }),
//   reduce(concat, nothing())
// )([
//   nothingWhenBoundToMark(trackingNavigator),
//   nothingWhenNotBoundToMark(markTrackingNavigator)
// ]))

const TrackingSwitch = connect((state: any) => {
  return {
    boundToMark: isBoundToMark(state)
  }
})(props => {
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
    options: { title: I18n.t('title_race_course') } })),
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
]))

const accountNavigator = Component(props => compose(
  fold(props),
  stackNavigator({ initialRouteName: Screens.AccountList, ...stackNavigatorConfig, screenOptions: screenWithHeaderOptions }),
  reduce(concat, nothing()))([
  stackScreen(withoutHeader({ name: Screens.AccountList, component: AccountList })),
  stackScreen(compose(withLeftHeaderBackButton)({ name: Screens.UserProfile, component: UserProfile, options: { title: I18n.t('title_your_account') } })),
  stackScreen(compose(withLeftHeaderBackButton)({ name: Screens.TeamList, component: TeamList, options: { title: I18n.t('caption_tab_teamlist') } })),
  stackScreen(compose(withLeftHeaderBackButton)({ name: Screens.AppSettings, component: AppSettings, options: { title: I18n.t('caption_tab_appsettings') } })),
  stackScreen(compose(withRightModalBackButton, withoutHeaderLeft)({ name: Screens.ExpertSettings, component: ExpertSettings, options: { title: I18n.t('title_expert_settings') } })),
  stackScreen(compose(withLeftHeaderBackButton, )({ name: Screens.TeamDetails, component: TeamDetails, options: ({ route }) => ({
    headerTitle: () => <TeamDetailsHeader/>,
    headerRight: () => teamDeleteHeader(route),
  }) })),
]))

const trackingTabPress = (props: any) => {
  const { navigation, route, preventDefault } = props
  const selectedTab = route.state?.routes[route.state?.index]

  if (selectedTab && selectedTab.name === Screens.TrackingNavigator) {
    const selectedTrackingStack = selectedTab.state.routes[selectedTab.state.index].name
    const toPrevent = [Screens.Tracking, Screens.SetWind, Screens.Leaderboard]
    const toGoBack = [Screens.SetWind, Screens.Leaderboard]

    if (includes(selectedTrackingStack, toPrevent))
      preventDefault()
    if (includes(selectedTrackingStack, toGoBack))
      navigation.goBack()
  }
}

const mainTabsNavigator = Component(props => compose(
  fold(props),
  tabsNavigator({
    initialRouteName: Screens.TrackingNavigator,
    lazy: false,
    backBehavior: 'initialRoute',
    tabBarOptions: {
      activeTintColor: $primaryTextColor,
      inactiveTintColor: $secondaryTextColor,
      style: {
        backgroundColor: '#123748',
      },
      showLabel: true,
      showIcon: true,
      keyboardHidesTabBar: (Platform.OS === 'android') ? true : false,
    },
    screenOptions: ({ route }) => ({
      tabBarIcon: ({ color, focused }) => getTabBarIcon(route, color, focused),
      tabBarLabel: ({ color, focused }) => getTabBarLabel(route, color, focused),
    })
  }),
  reduce(concat, nothing()))([
  tabsScreen({ name: Screens.TrackingNavigator, component: TrackingSwitch, listeners: { tabPress: event => trackingTabPress(merge(props, event)) } }),
  tabsScreen({ name: Screens.SessionsNavigator, component: sessionsNavigator.fold }),
  tabsScreen({ name: Screens.Inventory, component: MarkInventory.fold }),
  tabsScreen({ name: Screens.Account, component: accountNavigator.fold }),
]))

const AppNavigator = Component(props => compose(
  fold(props),
  stackNavigator({
    initialRouteName: props.isLoggedIn ? Screens.Main : Screens.FirstContact,
    ...stackNavigatorConfig,
    screenOptions: screenWithHeaderOptions }),
  reduce(concat, nothing()))([
  stackScreen(withoutHeader({ name: Screens.Splash, component: SplashScreen })),
  stackScreen(withoutHeader({ name: Screens.FirstContact, component: FirstContact })),
  stackScreen(withoutHeader({ name: Screens.JoinRegatta, component: JoinRegatta })),
  stackScreen(withoutHeader({ name: Screens.EditCompetitor, component: EditCompetitor })),
  stackScreen(withoutHeaderLeft({ name: Screens.RegisterBoat, component: RegisterBoat, options: { title: I18n.t('title_your_team') } })),
  stackScreen(withoutHeader({ name: Screens.Main, component: mainTabsNavigator.fold })),
  stackScreen(compose(withTransparentHeader, withGradientHeaderBackground,
    withRightModalBackButton, withoutHeaderLeft, withoutTitle)(
    { name: Screens.QRScanner, component: QRScanner })),
  stackScreen(compose(withoutHeaderLeft, withTransparentHeader, withRightModalBackButton, withoutTitle)({
    name: Screens.LoginFromSplash, component: Login
  })),
  stackScreen(compose(withTransparentHeader, withoutHeaderTitle, withGradientHeaderBackground, withLeftHeaderBackButton)({
    name: Screens.Login, component: Login
  })),
  stackScreen(compose(withTransparentHeader, withoutHeaderTitle, withoutHeaderLeft, withGradientHeaderBackground, withRightModalBackButton)({
    name: Screens.RegisterCredentials, component: RegisterCredentials
  })),
  stackScreen(compose(withoutTitle, withTransparentHeader, withGradientHeaderBackground, withLeftHeaderBackButton)({
    name: Screens.PasswordReset, component: PasswordReset
  }))
]))

class AppRoot extends ReactComponent {
  public deepLinkSubscriber: any

  public componentDidMount() {
    this.initDeepLinks()
    DeepLinking.addListener(this.handleDeeplink)
    LocationService.addStatusListener(this.handleLocationTrackingStatus)
    LocationService.addLocationListener(this.handleGeolocation)
    LocationService.registerEvents()
    this.props.initLocationUpdates()
    this.props.initializeApp(navigationContainer.current)
  }

  public componentWillUnmount() {
    DeepLinking.removeListener(this.handleDeeplink)
    this.finalizeDeepLinks()
    LocationService.removeStatusListener(this.handleLocationTrackingStatus)
    LocationService.removeLocationListener(this.handleGeolocation)
    LocationService.unregisterEvents()
    GpsFixService.stopGPSFixUpdates()
  }

  public render() {
    const { isLoggedIn,isLoadingCheckIn } = this.props
    return (
      <ActionSheetProvider>
        <AuthContext.Provider value = {{ isLoggedIn }}>
          <NavigationContainer ref={navigationContainer}>
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
  isLoadingCheckIn: isLoadingCheckIn(state)
})

export default connect(mapStateToProps, {
  performDeepLink,
  updateTrackingStatus,
  handleLocation,
  initLocationUpdates,
  initializeApp
})(AppRoot)
