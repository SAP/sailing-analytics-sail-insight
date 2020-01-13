import { __, always, append, compose, concat, curry,
  equals, has, head, length, map, merge, objOf,
  prepend, prop, propEq, range, reduce, reject,
  remove, split, toString, toUpper, update, when } from 'ramda'

import { Component, contramap, fold, fromClass, nothing,
  recomposeWithHandlers as withHandlers } from 'components/fp/component'
import { forwardingPropsFlatList, inlineText, text, touchableOpacity, view } from 'components/fp/react-native'
import ModalSelector from 'react-native-modal-selector'
import QRCode from 'react-native-qrcode-svg'
import Images from '@assets/Images'
import IconText from 'components/IconText'
import I18n from 'i18n'
import styles from './styles'
import { Dimensions } from 'react-native'

const maxNumberOfRaces = 50

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

export const overlayPicker = curry((
  { selectedValue, onValueChange, style, min = 1, max = maxNumberOfRaces + 1,
    withRemoveOption = false }, c) =>
    Component(props => compose(
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
          when(always(equals(withRemoveOption, true)), prepend({ key: 0, label: 'Remove' })),
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
    onValueChange: (value: number) => value === 0 ?
      props.removeDiscardItem(props.item.index) :
      props.updateDiscardItem(props.item.index, value),
    max: props.maxNumberOfDiscards || maxNumberOfRaces + 1,
    withRemoveOption: true
  }),
  view({ style: styles.discardSelectorItemContainer }),
  text({ style: styles.discardSelectorItemText }))(
  props.item.value))

const AddDiscardButton = Component((props: any) => compose(
  fold(props),
  overlayPicker({
    onValueChange: (value: number) => props.addDiscard(value),
    max: props.maxNumberOfDiscards || maxNumberOfRaces + 1
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
    keyboardShouldPersistTaps: 'always'
  })))(forwardingPropsFlatList))

export const withUpdatingDiscardItem = handler => withHandlers({
  removeDiscardItem: (props: any) => (index: number) => compose(
    handler,
    map(prop('value')),
    reject(propEq('type', 'add')),
    remove(index, 1),
    prop('data'))(
    props),
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
    text({ style: styles.textLight }, props.startDate),
    text({ style: styles.headlineHeavy }, props.name),
    text({ style: [styles.textLast, styles.textLight] }, props.location),
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
    inlineText( props.boatClass !== '' ? { style: styles.text } : { style: styles.textLast }, [
      text({ style: styles.textLight }, 'Style '),
      props.boatClass !== '' ? text({ style: styles.textValue }, 'ONE DESIGN') : text({ style: styles.textValue }, 'HANDICAP')
    ]),
    props.boatClass !== '' ?
    inlineText( { style: styles.textLast }, [
      text({ style: styles.textLight }, 'Boat Class '),
      text({ style: styles.textValue }, props.boatClass),
    ]) : nothing()
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
    inlineText( { style: styles.text }, [
      text({ style: styles.textLight }, `${I18n.t('text_number_of_races')} `),
      text({ style: styles.textValue }, props.races)
    ]),

    inlineText( { style: styles.textLast }, [
      text({ style: styles.textLight }, 'Discard after Races '),
      text({ style: styles.textValue }, props.discardRaces),
    ]),
    styledButton({
      onPress: (props: any) => props.racesAndScoringOnPress && props.racesAndScoringOnPress(props),
    }, text({ style: styles.buttonContent }, toUpper(props.racesButtonLabel)))
  ]),
)

const qrCode = Component((props: any) => compose(
  fold(props),
  view({ style: styles.qrCodeContainer }))(
  fromClass(QRCode).contramap((props: any) => ({
    value: props.qrCodeLink,
    size: Dimensions.get('window').width - 85,
    backgroundColor: 'white',
    quietZone: 10
  }))
))

export const competitorsCard = Component((props: any) =>
  compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder4 }, nothing())),
    view({ style: styles.container4 }),
    reduce(concat, nothing())
  )([
    text({ style: styles.headline }, 'Competitors'.toUpperCase()),
    inlineText( { style: styles.text }, [
      text({ style: styles.textLight }, `Event Status `),
      text({ style: styles.textValue }, props.raceStatus)
    ]),
    text({ style: styles.textLast }, I18n.t('text_info_for_invite')),
    styledButton({
      onPress: (props: any) => props.inviteCompetitors && props.inviteCompetitors(props),
    }, text({ style: styles.buttonContent }, 'INVITE COMPETITORS')),
    qrCode
  ]),
)
