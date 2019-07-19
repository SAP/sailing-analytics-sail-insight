import { compose, reduce, concat, merge } from 'ramda'

import { checkOut, collectCheckInData } from 'actions/checkIn'
import { getCustomScreenParamData } from 'navigation/utils'
import { getSession } from 'selectors/session'

import { Component, fold, nothing, reduxConnect as connect } from 'components/fp/component';
import { view } from 'components/fp/react-native';

import { container } from 'styles/commons'
import styles from './styles'

import {
  overallStatusCard,
  typeAndBoatClassCard,
  sessionDetailsCard,
  racesAndScoringCard,
  competitorsCard
} from '../common'

const mapStateToProps = (state: any, props: any) => {
  const leaderboardName = getCustomScreenParamData(props)
  return {
    session: getSession(leaderboardName)(state)
  }
}

const sessionData = {
  name: 'Wednesday Regatta',
  startDate: '10.07.2019',
  overallStatus: 'Everything is good',
  handicapType: 'Handicap Regatta',
  ratingSystem: 'Rating System',
  races: 3,
  raceStatus: 'Race 1 is currently running',
  trackingStatus: 'All trackers are sending location updates',
  rankingType: 'One Design Regatta',
  scoring: 'Low Point Scoring',
  discardRace: 3,
  registrationType: 'Unmanaged Regatta',
  entries: 7,
  invitations: 4,
  acceptations: 2
}

export default Component(props => compose(
  fold(merge(props, sessionData)),
  connect(mapStateToProps, { checkOut, collectCheckInData }),
  view({ style: [ container.list, styles.cardsContainer ]}),
  reduce(concat, nothing()))([
  overallStatusCard, sessionDetailsCard, typeAndBoatClassCard, racesAndScoringCard, competitorsCard
]));
