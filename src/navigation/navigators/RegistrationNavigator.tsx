import React from 'react'
import { createStackNavigator } from 'react-navigation'

import Images from '@assets/Images'
import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'
import { button } from 'styles/commons'

import GradientNavigationBar from 'components/GradientNavigationBar'
import ImageButton from 'components/ImageButton'
import Login from 'containers/authentication/Login'
import RegisterBoat from 'containers/authentication/RegisterBoat'
import RegisterCredentials from 'containers/authentication/RegisterCredentials'
import RegisterName from 'containers/authentication/RegisterName'


const navHeaderTransparentProps = {
  headerTransparent: true,
  headerStyle: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    elevation: 0,
  },
}

export default createStackNavigator(
  {
    [Screens.RegisterName]: {
      screen: RegisterName,
      navigationOptions: () => ({
        ...navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
      }),
    },
    [Screens.RegisterCredentials]: {
      screen: RegisterCredentials,
      navigationOptions: () => ({
        title: I18n.t('title_your_account'),
        headerRight: (
          <ImageButton style={button.actionIconNavBar} source={Images.actions.help}/>
        ),
      }),
    },
    [Screens.RegisterBoat]: {
      screen: RegisterBoat,
      navigationOptions: () => ({
        title: I18n.t('title_your_boat'),
      }),
    },
    [Screens.Login]: {
      screen: Login,
      navigationOptions: () => ({
        ...navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
      }),
    },
  },
  {
    initialRouteName: Screens.RegisterName,
    mode: 'card',
    headerMode: 'screen',
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
