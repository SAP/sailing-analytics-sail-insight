import { compose, merge, reduce, concat, curry, map } from 'ramda'

import { Component, contramap, fold, fromClass, nothing } from 'components/fp/component'
import { text, touchableOpacity, view } from 'components/fp/react-native'
import IconText from 'components/IconText'

import Images from '@assets/Images'
import { navigateToNewSessionReviewAndCreate } from 'navigation'

import styles from './styles'

const ArrowRight = fromClass(IconText).contramap(merge({
  source: Images.actions.arrowRight,
  style: { justifyContent: 'center' } }));

export const nextButton = (onPress: any, label: string) =>
  Component((props: any) =>
    compose(
      fold(props),
      touchableOpacity({ onPress }),
      contramap(merge({
        source: Images.actions.arrowRight,
        alignment: 'horizontal',
        iconPosition: 'second',
        children: label,
      })))
    (fromClass(IconText)))

export const reviewButton = (onPress?: any) => Component((props: object) => compose(
  fold(props),
  touchableOpacity({
    onPress: onPress || navigateToNewSessionReviewAndCreate,
    style: {
      backgroundColor: '#1897FE',
      marginHorizontal: '5%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    }
  }),
  text({ style: { color: '#FFFFFF' }}))(
  'Review and create'))

const toTouchableCard = curry(({ onPress, icon }, content: any) =>
  Component((props: any) =>
    compose(
      fold(props),
      touchableOpacity({ onPress }),
      view({ style: styles.card }),
      reduce(concat, nothing()))
    ([
      fromClass(IconText).contramap(merge({ source: icon })),
      view({ style: styles.cardContent }, content),
      ArrowRight ])));

export const overallStatusCard = Component((props: any) =>
  compose(
    fold(props),
    toTouchableCard({ icon: Images.info.boat, onPress: () => console.log('press on competitors')}),
    reduce(concat, nothing()),
    map(text({})))
  ([
    props.overallStatus,
    props.raceStatus,
    props.trackingStatus ]));

export const typeAndBoatClassCard = Component((props: any) =>
  compose(
    fold(props),
    toTouchableCard({ icon: Images.info.location, onPress: () => console.log('press on competitors', props)}),
    reduce(concat, nothing()),
    map(text({})))
  ([
    'Regatta Type and Boat Class',
    props.rankingType ]));

export const sessionDetailsCard = Component((props: any) =>
  compose(
    fold(props),
    toTouchableCard({ icon: Images.info.competitor, onPress: () => console.log('press on competitors')}),
    reduce(concat, nothing()),
    map(text({})))
  ([
    props.name,
    props.startDate,
    props.handicapType,
    props.ratingSystem
  ]));

export const racesAndScoringCard = Component((props: any) =>
  compose(
    fold(props),
    toTouchableCard({ icon: Images.info.competitor, onPress: () => console.log('press on competitors')}),
    reduce(concat, nothing()),
    map(text({})))
  ([
    'Races and Scoring',
    `${props.races} Races Planned`,
    props.scoring,
    `Discard starting from ${props.discardRace}. race` ]));

export const competitorsCard = Component((props: any) =>
  compose(
    fold(props),
    toTouchableCard({ icon: Images.info.competitor, onPress: () => console.log('press on competitors')}),
    reduce(concat, nothing()),
    map(text({})))
  ([
    'Competitors',
    `${props.registrationType} – ${props.entries} Entries`,
    'Invitations: 4 / Acceptations: 2' ]));
