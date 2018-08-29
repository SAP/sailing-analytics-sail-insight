import React from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'

import Images from '@assets/Images'
import { buttons, container, navigation as navigationStyles } from 'styles/commons'

import { navigateBack } from 'navigation'
import * as Screens from 'navigation/Screens'

import HeaderTitle from 'components/HeaderTitle'
import TextButton from 'components/TextButton'
import AppSettings from 'containers/AppSettings'
import RegattaDetail from 'containers/RegattaDetail'
import SplashScreen from 'containers/SplashScreen'
import Tracking from 'containers/Tracking'

import CheckInNavigator from './CheckInNavigator'
import MainTabNavigator from './MainTabNavigator'


const logoHeaderLeft = () => <Image style={container.logo} source={Images.corporateIdentity.sapSailingLogo} />
const multilineHeaderTitle = (navigation: any = {}) => (
  <HeaderTitle
    firstLine={navigation.state.params.heading}
    secondLine={navigation.state.params.subHeading}
  />
)

export default createStackNavigator(
  {
    [Screens.Splash]: {
      screen: SplashScreen,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.MainTabs]: {
      screen: MainTabNavigator,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.CheckInNavigator]: {
      screen: CheckInNavigator,
      navigationOptions: {
        header: null,
      },
    },
    [Screens.RegattaDetail]: {
      screen: RegattaDetail,
      navigationOptions: ({ navigation }: any) => ({
        headerTitle: multilineHeaderTitle(navigation),
      }),
    },
    [Screens.AppSettings]: {
      screen: AppSettings,
      navigationOptions: () => ({
        title: I18n.t('title_app_settings'),
        headerLeft: logoHeaderLeft,
        headerRight: (
          <TextButton
            onPress={navigateBack}
            textStyle={buttons.navigationBack}
          >
            {I18n.t('caption_done')}
          </TextButton>
        ),
      }),
    },
    [Screens.Tracking]: {
      screen: Tracking,
      navigationOptions: ({ navigation }: any) => ({
        headerLeft: logoHeaderLeft,
        gesturesEnabled: false,
        headerTitle: multilineHeaderTitle(navigation),
      }),
    },
  },
  {
    initialRouteName: Screens.Splash,
    mode: 'modal',
    headerMode: 'screen',
    navigationOptions: (options: any) => ({
      headerTitleStyle: navigationStyles.headerTitle,
    }),
  },
)
