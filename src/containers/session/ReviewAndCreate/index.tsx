import { compose, reduce, concat, merge } from 'ramda'

import { Component, fold, nothing, reduxConnect as connect } from 'components/fp/component';
import { view } from 'components/fp/react-native';

import { container } from 'styles/commons'
import styles from './styles'

import { nextButton } from '../common'

import {
  typeAndBoatClassCard,
  sessionDetailsCard,
  racesAndScoringCard,
  competitorsCard
} from '../common'

const mapStateToProps = (state: any, props: any) => {
  return {}
}

const sessionData = {
  name: 'Wednesday Regatta',
  startDate: '10.07.2019',
  handicapType: 'Handicap Regatta',
  ratingSystem: 'Rating System',
  races: 3,
  rankingType: 'One Design Regatta',
  scoring: 'Low Point Scoring',
  discardRace: 3,
  registrationType: 'Unmanaged Regatta',
  entries: 7,
  invitations: 4,
  acceptations: 2
}

export default Component((props: any) =>
  compose(
    fold(merge(props, sessionData)),
    connect(mapStateToProps),
    view({ style: [ container.list, styles.cardsContainer ]}),
    reduce(concat, nothing()))
  ([
    sessionDetailsCard,
    typeAndBoatClassCard,
    racesAndScoringCard,
    competitorsCard,
    nextButton(() => {}, 'Create Event') ]));
