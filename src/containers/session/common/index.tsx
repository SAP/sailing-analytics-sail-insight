import { __, always, compose, concat, curry, equals,
  has, head, length, map, merge, objOf, prepend,
  range, reduce, split, toString, when, toUpper,
  reject, propEq, append, prop, update } from 'ramda'

import { Component, fold, fromClass, nothing, contramap,
  recomposeWithHandlers as withHandlers } from 'components/fp/component'
import { text, touchableOpacity, view, forwardingPropsFlatList } from 'components/fp/react-native'
import ModalSelector from 'react-native-modal-selector'

import I18n from 'i18n'
import styles from './styles'
import Images from '@assets/Images'
import IconText from 'components/IconText'

const plusIcon = fromClass(IconText).contramap(always({
  source: Images.actions.plus,
  iconTintColor: 'white',
  style: { justifyContent: 'center', alignItems: 'center' },
  iconStyle: { width: 25, height: 25 }
}))

const styledButton = curry(({ onPress }, content: any) =>
  Component((props: any) =>
    compose(
      fold(props),
      touchableOpacity({ onPress }))(
      view({ style: styles.button }, content))))

export const overlayPicker = curry(({ selectedValue, onValueChange, style, min = 1, max = 51 }, c) => Component(props => compose(
    fold(props),
    fromClass(ModalSelector).contramap,
    always,
    merge({
      style: merge({ backgroundColor: 'transparent' }, style),
      optionContainerStyle: {
        marginTop: 30,
        backgroundColor: '#123748',
      },
      optionTextStyle: {
        color: '#FFFFFF',
        fontSize: 40,
        fontFamily: 'SFCompactText-Regular',
      },
      selectedKey: selectedValue,
      onChange: (v: any) => onValueChange(v.key),
      cancelText: (I18n.t('caption_cancel')),
      data: compose(
        map(v => ({ key: v, label: v.toString() })))(
        range(min, max))
    }),
    objOf('children'),
    head,
    when(has('fold'), fold(props)))(
    c)))

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
  toString)(
  props.value))

const DiscardSelectorItem = Component((props: any) => compose(
  fold(props),
  overlayPicker({
    onValueChange: (value: number) => props.updateDiscardItem(props.item.index, value)
  }),
  view({ style: styles.discardSelectorItemContainer }),
  text({ style: styles.discardSelectorItemText }))(
  props.item.value))

const AddDiscardButton = Component((props: any) => compose(
  fold(props),
  overlayPicker({
    onValueChange: (value: number) => props.addDiscard(value)
  }),
  view({ style: styles.discardSelectorPlusContainer }))(
  plusIcon))

export const DiscardSelector = Component((props: any) => compose(
  fold(props),
  concat(text({ style: styles.textHeader }, 'Discard after race numbers')),
  view({ style: styles.discardContainer }),
  contramap(merge({
    style: { flexGrow: 0 },
    renderItem: (props: any) =>
      props.item.type === 'add' ?
        AddDiscardButton.fold(props) :
        DiscardSelectorItem.fold(props),
    showsHorizontalScrollIndicator: false,
    horizontal: true,
  })))(forwardingPropsFlatList))

export const withUpdatingDiscardItem = handler => withHandlers({
  updateDiscardItem: (props: any) => (index: number, value: object) => compose(
    handler,
    map(prop('value')),
    reject(propEq('type', 'add')),
    update(index, { index, value }),
    prop('data'))(
    props)
})

export const withAddDiscard = handler => withHandlers({
  addDiscard: (props: any) => (value: number) => compose(
    handler,
    append(value),
    map(prop('value')),
    reject(propEq('type', 'add')),
    prop('data'))(
    props)
})

/*
* SessionDetails
*/
export const sessionDetailsCard = Component((props: any) =>
  compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder1 }, nothing())),
    view({ style: styles.container1 }),
    reduce(concat, nothing()),
  )([
    text({ style: styles.headlineHeavy }, props.name),
    text({ style: styles.text }, props.startDate),
    text({ style: styles.text }, props.handicapType),
    text({ style: styles.textLast }, props.ratingSystem),
  ]),
)

export const typeAndBoatClassCard = Component((props: any) =>
  compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder2 }, nothing())),
    view({ style: styles.container2 }),
    reduce(concat, nothing()),
  )([
    text({ style: styles.headline }, 'Regatta Details'.toUpperCase()),
    text({ style: styles.textLast }, props.rankingType),
  ]),
)

export const racesAndScoringCard = Component((props: any) =>
  compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder3 }, nothing())),
    view({ style: styles.container3 }),
    reduce(concat, nothing()),
  )([
    text({ style: styles.headline }, 'Races and Scoring'.toUpperCase()),
    text({ style: styles.text }, `${props.races} Races Planned`),
    text({ style: styles.text }, props.scoring),
    text({ style: styles.textLast }, `Discard starting from ${props.discardRace}. race`),
    styledButton({
      onPress: (props: any) => props.racesAndScoringOnPress && props.racesAndScoringOnPress(props),
    }, text({ style: styles.buttonContent }, toUpper(props.racesButtonLabel)))
  ]),
)

export const competitorsCard = Component((props: any) =>
  compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder4 }, nothing())),
    view({ style: styles.container4 }),
    reduce(concat, nothing())
  )([
    text({ style: styles.headline }, 'Competitors'),
    text({ style: styles.text }, `${props.registrationType} – ${props.entries} Entries`),
    styledButton({
      onPress: (props: any) => props.inviteCompetitors && props.inviteCompetitors(props),
    }, text({ style: styles.buttonContent }, 'INVITE COMPETITORS'))
  ]),
)
