import React from 'react'
import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'

import ModalBackButton from 'components/ModalBackButton'
import EditSession from 'containers/session/EditSession'
import TrackingSetup from 'containers/tracking/TrackingSetup'

export default createStackNavigator(
  {
    [Screens.TrackingSetup]: {
      screen: TrackingSetup,
      navigationOptions: () => ({
        title: I18n.t('caption_new_session'),
        headerLeft: null,
        headerRight: <ModalBackButton/>,
      }),
    },
    [Screens.EditSession]: {
      screen: EditSession,
      navigationOptions: {
        title: I18n.t('title_edit_session'),
      },
    },
  },
  {
    initialRouteName: Screens.TrackingSetup,
    mode: 'card',
    headerMode: 'screen',
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
