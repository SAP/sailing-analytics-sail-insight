import { __, always, compose, concat, curry, equals, length, map, tap,
  merge, mergeLeft, objOf, prepend, range, reduce, split, toString, when } from 'ramda'

import { Component, fold, fromClass, nothing } from 'components/fp/component'
import { text, touchableOpacity, view } from 'components/fp/react-native'
import { Picker } from 'react-native'

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

export const overlayPicker = ({ selectedValue, onValueChange, style, min = 1, max = 51 }: any) =>
  concat(__, fromClass(Picker).contramap(mergeLeft({
    style: merge(style, { backgroundColor: 'transparent' }),
    selectedValue,
    onValueChange: (v: number) => setTimeout(() => onValueChange(v), 0),
    children: compose(
      map(fromClass(Picker.Item).fold),
      map(v => ({ value: v, label: v.toString() })))(
      range(min, max))
  })))

export const FramedNumberItem = Component(props => compose(
  fold(props),
  view({ style: styles.framedNumberItem }),
  text({ style: styles.framedNumberItemText }))(
  props.value))

export const FramedNumber = Component(props => compose(
  fold(props),
  view({ style: styles.framedNumber }),
  reduce(concat, nothing()),
  map(compose(FramedNumberItem.contramap, always, objOf('value'))),
  when(compose(equals(1), length), prepend('0')),
  split(''),
  tap(() => console.log('framed number', props.value)),
  toString)(
  props.value))

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
