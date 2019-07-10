import { curry, map, compose, reduce, concat, merge } from 'ramda'

import { checkOut, collectCheckInData } from 'actions/checkIn'
import { getCustomScreenParamData } from 'navigation/utils'
import { getSession } from 'selectors/session'

import IconText from 'components/IconText'
import { Component, fold, nothing, fromClass, reduxConnect as connect } from 'components/fp/component';
import { text, view, touchableOpacity } from 'components/fp/react-native';

import Images from '@assets/Images'
import { container } from 'styles/commons'
import styles from './styles'

const mapStateToProps = (state: any, props: any) => {
  const leaderboardName = getCustomScreenParamData(props)
  return {
    session: getSession(leaderboardName)(state)
  }
}

const ArrowRight = fromClass(IconText).contramap(merge({
  source: Images.actions.arrowRight,
  style: { justifyContent: 'center' } }));

const toTouchableCard = curry(({ onPress, icon }, content: any) => Component((props: any) => compose(
  fold(props),
  touchableOpacity({ onPress }),
  view({ style: styles.card }),
  reduce(concat, nothing()))([
    fromClass(IconText).contramap(merge({ source: icon })),
    view({ style: styles.cardContent }, content),
    ArrowRight
  ]
)));

const overallStatus = Component((props: any) => compose(
  fold(props),
  toTouchableCard({ icon: Images.info.boat, onPress: () => console.log('press on competitors')}),
  reduce(concat, nothing()),
  map(text({})))([
  'Everything is good',
  'Race 1 is currently running',
  'All trackers are sending location updates.'
]));

const typeAndBoatClass = Component((props: any) => compose(
  fold(props),
  toTouchableCard({ icon: Images.info.location, onPress: () => console.log('press on competitors')}),
  reduce(concat, nothing()),
  map(text({})))([
  'Regatta Type and Boat Class',
  'One Design Regatta'
]));

const sessionDetails = Component((props: any) => compose(
  fold(props),
  toTouchableCard({ icon: Images.info.competitor, onPress: () => console.log('press on competitors')}),
  reduce(concat, nothing()),
  map(text({})))([
  'Wednesday Regatta',
  '10.07.2019',
  'Handicap Regatta',
  'Rating System'
]));

const racesAndScoring = Component((props: any) => compose(
  fold(props),
  toTouchableCard({ icon: Images.info.competitor, onPress: () => console.log('press on competitors')}),
  reduce(concat, nothing()),
  map(text({})))([
  'Races and Scoring',
  '10 Races Planned',
  'Low Point Scoring',
  'Discard starting from 3. race'
]));

const competitors = Component((props: any) => compose(
  fold(props),
  toTouchableCard({ icon: Images.info.competitor, onPress: () => console.log('press on competitors')}),
  reduce(concat, nothing()),
  map(text({})))([
  'Competitors',
  'Unmanaged Regatta – 7 Entries',
  'Invitations: 4 / Acceptations: 2'
]));

export default Component(props => compose(
  fold(props),
  connect(mapStateToProps, { checkOut, collectCheckInData }),
  view({ style: [ container.list, styles.cardsContainer ]}),
  reduce(concat, nothing()))([
  overallStatus, sessionDetails, typeAndBoatClass, racesAndScoring, competitors
]));
