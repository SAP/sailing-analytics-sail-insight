// import { get } from 'lodash'
import React from 'react'
import { createStackNavigator } from 'react-navigation'

// import Images from '@assets/Images'
import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'

import GradientNavigationBar from 'components/GradientNavigationBar'
// import ImageButton from 'components/ImageButton'
import ModalBackButton from 'components/ModalBackButton'
import Login from 'containers/authentication/Login'
import PasswordReset from 'containers/authentication/PasswordReset'
import RegisterBoat from 'containers/authentication/RegisterBoat'
import RegisterCredentials from 'containers/authentication/RegisterCredentials'
// import RegisterName from 'containers/authentication/RegisterName'

import { $headerTintColor } from 'styles/colors'
// import { button } from 'styles/commons'


export default createStackNavigator(
  {
    /*
    [Screens.RegisterName]: {
      screen: RegisterName,
      navigationOptions: () => ({
        ...commons.navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
        headerRight: <ModalBackButton type="icon" iconColor={$headerTintColor} />,
      }),
    },
    */
    [Screens.RegisterCredentials]: {
      screen: RegisterCredentials,
      /*
      navigationOptions: ({ navigation: navigationProps }: any) => ({
        title: I18n.t('title_your_account'),
        headerRight: (
          <ImageButton
            style={button.actionIconNavBar}
            source={Images.actions.help}
            onPress={get(navigationProps, 'state.params.onOptionsPressed')}
          />
        ),
      }),
      */
      navigationOptions: () => ({
        ...commons.navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
        headerRight: <ModalBackButton type="icon" iconColor={$headerTintColor} />,
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
        ...commons.navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
      }),
    },
    [Screens.PasswordReset]: {
      screen: PasswordReset,
      navigationOptions: () => ({
        ...commons.navHeaderTransparentProps,
        header: (props: any) => <GradientNavigationBar transparent="true" {...props} />,
      }),
    },
  },
  {
    initialRouteName: Screens.RegisterCredentials,
    ...commons.stackNavigatorConfig,
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
