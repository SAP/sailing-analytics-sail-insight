import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import React, { Component as ReactComponent } from 'react'
import { connect } from 'react-redux'
import { compose, reduce, concat, mergeDeepLeft, merge } from 'ramda'
import { Text } from 'react-native'
import 'store/init'

import GradientNavigationBar from 'components/GradientNavigationBar'
import ModalBackButton from 'components/ModalBackButton'
import SplashScreen from 'containers/SplashScreen'
import * as Screens from 'navigation/Screens'
import * as commons from 'navigation/commons'
import Images from '@assets/Images'
import Logger from 'helpers/Logger'
import * as DeepLinking from 'integrations/DeepLinking'
import * as LocationService from 'services/LocationService'
import { initializeApp } from 'actions/appLoading'
import { performDeepLink } from 'actions/deepLinking'
import { handleLocation, initLocationUpdates } from 'actions/locations'
import { updateTrackingStatus } from 'actions/locationTrackingData'
import * as GpsFixService from './services/GPSFixService'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'
import { isLoadingSplash } from 'selectors/checkIn'
import { NavigationContainer } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import { AuthContext } from 'navigation/NavigationContext'
import { stackScreen, stackNavigator, tabsScreen, tabsNavigator } from 'components/fp/navigation'
import { Component, fold, nothing, fromClass } from 'components/fp/component'
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
import AccountList from 'containers/user/AccountList'
import TeamList from 'containers/user/TeamList'
import EventCreation from 'containers/session/EventCreation'
import ExpertSettings from 'containers/ExpertSettings'
import Leaderboard from 'containers/session/Leaderboard/Leaderboard'
import SetWind from 'containers/tracking/SetWind'
import Tracking from 'containers/tracking/Tracking'
import WelcomeTracking from 'containers/tracking/WelcomeTracking'
import HeaderTitle from 'components/HeaderTitle'
import { getFormTeamName } from 'selectors/boat'
import UserProfile from 'containers/user/UserProfile'
import ImageButton from 'components/ImageButton'
import I18n from 'i18n'
import { $headerTintColor, $primaryTextColor, $secondaryTextColor, $primaryBackgroundColor } from 'styles/colors'
import { getTabItemTitleTranslation } from 'helpers/texts'
import IconText from 'components/IconText'
import { tab, navigation as navigationStyles } from 'styles/commons'

interface Props {
  initializeApp: () => void,
  performDeepLink: any
  updateTrackingStatus: any
  handleLocation: any
  initLocationUpdates: any
  isLoggedIn: any
  showSplash: any
}

const withoutHeader = mergeDeepLeft({ options: { headerShown: false } })
const withoutTitle = mergeDeepLeft({ options: { title: '' }})
const withoutHeaderTitle = mergeDeepLeft({ options: { headerTitle: () => null }})
const withoutHeaderLeft = mergeDeepLeft({ options: { headerLeft: () => null } })
const withTransparentHeader = mergeDeepLeft({ options: { ...commons.navHeaderTransparentProps } })
const withGradientHeaderBackground = mergeDeepLeft({ options: { headerBackground: (props: any) => <GradientNavigationBar transparent="true" {...props} /> } })
const withRightModalBackButton = mergeDeepLeft({ options: { headerRight: () => <ModalBackButton type="icon" iconColor={$headerTintColor} /> } })
const withLeftHeaderBackButton = mergeDeepLeft({ options: ({ navigation }: any) =>
  ({ headerLeft: props => <HeaderBackButton onPress={navigation.goBack} tintColor="white" labelVisible={false} {...props}/>})})

const getInitialRouteName = props =>
  props.isLoadingSplash ? Screens.Splash :
  props.isLoggedIn ? Screens.Main :
  Screens.FirstContact

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

  return (
    <IconText
      style={{marginTop: 6}}
      iconStyle={[tab.tabItemIcon, { tintColor: iconTintColor }]}
      textStyle={[tab.bottomTabItemText, { color: tintColor }, focusStyle]}
      source={icon}
      iconTintColor={iconTintColor}
      iconPosition="first"
      iconOnly={false}
    />
  )
}

const getTabBarLabel = (route: any, color: any, focused: any) => {
  const { name = '' } = route
  const tintColor = color
  const focusStyle = focused ? { fontWeight: 'bold' } : undefined

  return (
    <Text style={[tab.bottomTabItemText, {color: tintColor, marginBottom: 3}, focusStyle ]}>{getTabItemTitleTranslation(name)}</Text>
  )
}

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

const sessionsNavigator = Component(props => compose(
  fold(props),
  stackNavigator({ initialRouteName: Screens.Sessions, ...stackNavigatorConfig, screenOptions: screenWithHeaderOptions }),
  reduce(concat, nothing()))([
  stackScreen(withoutHeader({ name: Screens.Sessions, component: Sessions })),
]))

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

const mainTabsNavigator = Component(props => compose(
  fold(props),
  tabsNavigator({
    initialRouteName: Screens.TrackingNavigator,
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
  tabsScreen({ name: Screens.TrackingNavigator, component: trackingNavigator.fold }),
  tabsScreen({ name: Screens.SessionsNavigator, component: sessionsNavigator.fold }),
  tabsScreen({ name: Screens.Inventory, component: MarkInventory.fold }),
  tabsScreen({ name: Screens.Account, component: accountNavigator.fold }),
]))

const AppNavigator = Component(props => compose(
  fold(props),
  stackNavigator({ initialRouteName: getInitialRouteName(props) }),
  reduce(concat, nothing()))([
  stackScreen(withoutHeader({ name: Screens.Splash, component: SplashScreen })),
  stackScreen(withoutHeader({ name: Screens.FirstContact, component: FirstContact })),
  stackScreen(withoutHeader({ name: Screens.JoinRegatta, component: JoinRegatta })),
  stackScreen(withoutHeader({ name: Screens.EditCompetitor, component: EditCompetitor })),
  stackScreen(withoutHeader({ name: Screens.Main, component: mainTabsNavigator.fold })),
  stackScreen(withLeftHeaderBackButton({ name: Screens.EventCreation, component: EventCreation.fold, options: { title: I18n.t('title_event_creation') } })),
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

class AppRoot extends ReactComponent<Props> {
  public deepLinkSubscriber: any

  public componentDidMount() {
    this.initDeepLinks()
    DeepLinking.addListener(this.handleDeeplink)
    LocationService.addStatusListener(this.handleLocationTrackingStatus)
    LocationService.addLocationListener(this.handleGeolocation)
    LocationService.registerEvents()
    this.props.initLocationUpdates()
    this.props.initializeApp()
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
    const { isLoggedIn, showSplash } = this.props
    return (
      <ActionSheetProvider>
        <AuthContext.Provider value = {{isLoading: showSplash, isLoggedIn}}>
          <NavigationContainer>
            { AppNavigator.fold(this.props) }
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
    this.props.performDeepLink(params)
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
  isLoadingSplash: isLoadingSplash(state),
})

export default connect(mapStateToProps, {
  performDeepLink,
  updateTrackingStatus,
  handleLocation,
  initLocationUpdates,
  initializeApp
})(AppRoot)
