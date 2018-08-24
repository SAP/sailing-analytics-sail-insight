import React from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'

import Images from '@assets/Images'
import { buttons, container, navigation } from 'styles/commons'

import * as Screens from 'navigation/Screens'

import ImageButton from 'components/ImageButton'
import TextButton from 'components/TextButton'
import AppSettings from 'containers/AppSettings'
import RegattaDetail from 'containers/RegattaDetail'
import Welcome from 'containers/Welcome'
import { navigateBack } from 'navigation'
import CheckInNavigator from './CheckInNavigator'


const logoHeaderLeft = () => <Image style={container.logo} source={Images.corporateIdentity.sapSailingLogo} />


export default createStackNavigator(
  {
    [Screens.Welcome]: {
      screen: Welcome,
      navigationOptions: {
        title: I18n.t('title_regattas'),
        headerLeft: logoHeaderLeft,
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
  },
  {
    initialRouteName: Screens.Welcome,
    mode: 'modal',
    headerMode: 'screen',
    navigationOptions: (options: any) => ({
      headerTitleStyle: navigation.headerTitle,
      headerRight: (
        <ImageButton
          onPress={
            options.navigation &&
            options.navigation.state &&
            options.navigation.state.params &&
            options.navigation.state.params.onOptionsPressed
          }
          source={Images.actionables.settings}
          imageStyle={buttons.actionIcon}
        />
      ),
    }),
  },
)
