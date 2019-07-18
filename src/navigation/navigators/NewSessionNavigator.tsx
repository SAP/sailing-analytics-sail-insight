import React from 'react'
import { createStackNavigator } from 'react-navigation'

import I18n from 'i18n'
import * as commons from 'navigation/commons'
import * as Screens from 'navigation/Screens'

import ModalBackButton from 'components/ModalBackButton'
import BasicsSetup from 'containers/session/BasicsSetup'
import Competitors from 'containers/session/Competitors'
import EditSession from 'containers/session/EditSession'
import RacesAndScoring from 'containers/session/RacesAndScoring'
import TypeAndBoatClass from 'containers/session/TypeAndBoatClass'

export default createStackNavigator(
  {
    [Screens.NewSessionBasics]: {
      screen: BasicsSetup.fold,
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
    [Screens.NewSessionTypeAndBoatClass]: {
      screen: TypeAndBoatClass.fold,
      navigationOptions: {
        title: I18n.t('title_edit_session'),
      },
    },
    [Screens.NewSessionRacesAndScoring]: {
      screen: RacesAndScoring.fold,
      navigationOptions: {
        title: I18n.t('title_edit_session'),
      },
    },
    [Screens.NewSessionCompetitors]: {
      screen: Competitors.fold,
      navigationOptions: {
        title: I18n.t('title_edit_session'),
      },
    },
  },
  {
    initialRouteName: Screens.NewSessionBasics,
    ...commons.stackNavigatorConfig,
    navigationOptions: () => commons.headerNavigationOptions,
  },
)
