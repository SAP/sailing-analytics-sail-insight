import { compose, concat, merge, reduce } from 'ramda'

import { Component, fold, nothing, reduxConnect as connect } from 'components/fp/component'
import { view } from 'components/fp/react-native'
import I18n from 'i18n'

import { container } from 'styles/commons'
import styles from './styles'

import {
  competitorsCard,
  nextButton,
  racesAndScoringCard,
  sessionDetailsCard,
  typeAndBoatClassCard,
} from '../common'

import { createEventActionQueue } from 'actions/events'
import {
  EVENT_CREATION_FORM_NAME,
  eventCreationDataFromFormValues,
} from 'forms/eventCreation'
import EventCreationData from 'models/EventCreationData'
import { navigateToMain } from 'navigation'
import { getFormValues } from 'selectors/form'

const mapStateToProps = (state: any, props: any) => {
  const eventData = compose(
    eventCreationDataFromFormValues,
    getFormValues(EVENT_CREATION_FORM_NAME),
  )(state)
  return {
    eventData,
    ...getViewCardPropsFromEventData(eventData),
  }
}

const getViewCardPropsFromEventData = (eventData: EventCreationData) => ({
  name: eventData.name,
  startDate: eventData.dateFrom || 'NO DATE SET',
  handicapType: 'Handicap Regatta',
  ratingSystem: 'Rating System',
  races: eventData.numberOfRaces,
  rankingType: `One Design Regatta - ${eventData.boatClass || 'NO BOATCLASS SET'}`,
  scoring: 'Low Point Scoring',
  discardRace: eventData.discardsStart,
  registrationType: 'Unmanaged Regatta',
  entries: 7,
  invitations: 4,
  acceptations: 2
})


export default Component((props: any) =>
  compose(
    fold(props),
    connect(mapStateToProps, { createEventActionQueue }),
    view({ style: [container.list, styles.cardsContainer] }),
    reduce(concat, nothing()))([
      sessionDetailsCard,
      typeAndBoatClassCard,
      racesAndScoringCard,
      competitorsCard,
      nextButton({
        onPress: createEvent,
        label: I18n.t('title_event_creation'),
      })]))
