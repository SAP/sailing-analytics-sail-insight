import React from 'react'
import { createStackNavigator } from 'react-navigation'

import Images from '@assets/Images'
import I18n from 'i18n'
import * as Screens from 'navigation/Screens'
import { button, navigation } from 'styles/commons'

import GradientNavigationBar from 'components/GradientNavigationBar'
import ImageButton from 'components/ImageButton'
import RegisterBoat from 'containers/registration/RegisterBoat'
import RegisterCredentials from 'containers/registration/RegisterCredentials'
import RegisterName from 'containers/registration/RegisterName'


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
  },
  {
    initialRouteName: Screens.RegisterName,
    mode: 'card',
    headerMode: 'screen',
    navigationOptions: { headerTitleStyle: navigation.headerTitle },
  },
)
