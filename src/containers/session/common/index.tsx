import {  __, compose, concat, curry, reduce } from 'ramda'

import { Component, fold, nothing } from 'components/fp/component'
import { text, touchableOpacity, view } from 'components/fp/react-native'


import styles from './styles'

const defineButton = curry(({ onPress }, content: any) =>
  Component((props: any) =>
    compose(
      fold(props),
      touchableOpacity({ onPress }))(
      view({ style: styles.button }, content))))

/*
export const ArrowRight = fromClass(IconText).contramap(merge({
  source: Images.actions.arrowRight,
  style: { justifyContent: 'center' } }))

const toTouchableCard = curry(({ onPress, icon }, content: any) =>
  Component((props: any) =>
    compose(
      fold(props),
      touchableOpacity({ onPress }),
      view({ style: styles.card }),
      reduce(concat, nothing()))([
        fromClass(IconText).contramap(merge({ source: icon })),
        view({ style: styles.cardContent }, content),
        ArrowRight,
      ])))

export const overallStatusCard = Component((props: any) =>
  compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder1 }, nothing())),
    view({ style: styles.container1 }),
    // toTouchableCard({ icon: Images.info.boat, onPress: () => console.log('press on competitors')}),
    reduce(concat, nothing()))([
      text({ style: styles.text }, props.overallStatus),
      text({ style: styles.text }, props.raceStatus),
      text({ style: styles.text }, props.trackingStatus),
    ]))
*/
export const sessionDetailsCard = Component((props: any) =>
  compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder1 }, nothing())),
    view({ style: styles.container1 }),
    reduce(concat, nothing()))([
      text({ style: styles.headlineHeavy }, props.name),
      text({ style: styles.text }, props.startDate),
      text({ style: styles.text }, props.handicapType),
      text({ style: styles.textLast }, props.ratingSystem),
    ]))

export const typeAndBoatClassCard = Component((props: any) =>
  compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder2 }, nothing())),
    view({ style: styles.container2 }),
    reduce(concat, nothing()))([
      text({ style: styles.headline }, 'Regatta Details'.toUpperCase()),
      text({ style: styles.textLast }, props.rankingType),
    ]))

export const racesAndScoringCard = Component((props: any) =>
  compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder3 }, nothing())),
    view({ style: styles.container3 }),
    reduce(concat, nothing()))([
      text({ style: styles.headline }, 'Races and Scoring'.toUpperCase()),
      text({ style: styles.text }, `${props.races} Races Planned`),
      text({ style: styles.text }, props.scoring),
      text({ style: styles.textLast }, `Discard starting from ${props.discardRace}. race`),
      defineButton({
        onPress: (props: any) => props.racesAndScoringOnPress && props.racesAndScoringOnPress(props),
      }, text({ style: styles.buttonContent }, 'Define Races'.toUpperCase()))
    ]))

export const competitorsCard = Component((props: any) =>
  compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder4 }, nothing())),
    view({ style: styles.container4 }),
    reduce(concat, nothing()))([
      text({ style: styles.headline }, 'Competitors'),
      text({ style: styles.text }, `${props.registrationType} – ${props.entries} Entries`),
      text({ style: styles.textLast }, 'Invitations: 4 / Acceptations: 2'),
    ]))
