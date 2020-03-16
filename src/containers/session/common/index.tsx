import Images from '@assets/Images'
import { Component, contramap, fold, fromClass, nothing,
  recomposeWithHandlers as withHandlers,
  recomposeBranch as branch,
  nothingAsClass } from 'components/fp/component'
import { forwardingPropsFlatList, iconText, inlineText, text, touchableOpacity, view } from 'components/fp/react-native'
import IconText from 'components/IconText'
import * as Screens from 'navigation/Screens'
import I18n from 'i18n'
import { __, always, append, compose, concat, curry,
  equals, has, head, length, map, merge, objOf,
  prepend, prop, propEq, range, reduce, reject,
  remove, split, toString, toUpper, update, when } from 'ramda'
import { Dimensions } from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import QRCode from 'react-native-qrcode-svg'
import styles from './styles'

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
        optionTextStyle: styles.textOverlay,
        selectedKey: selectedValue,
        onChange: (v: any) => onValueChange(v.key),
        cancelText: (I18n.t('caption_cancel')),
        data: compose(
          when(always(equals(withRemoveOption, true)), prepend({ key: 0, label: I18n.t('caption_remove_discard') })),
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
  concat(text({ style: styles.textHeader }, I18n.t('caption_discard_after_races'))),
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
    props),
})

export const withAddDiscard = handler => withHandlers({
  addDiscard: (props: any) => (value: number) => compose(
    handler,
    append(value),
    map(prop('value')),
    reject(propEq('type', 'add')),
    prop('data'))(
    props),
})

/*
* SessionDetails
*/
export const sessionDetailsCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder1 }, nothing())),
    view({ style: styles.container1 }),
    reduce(concat, nothing()),
  )([
    text({ style: styles.textLight }, props.startDate),
    text({ style: styles.headlineHeavy }, props.name),
    iconText({
      style: styles.location,
      iconStyle: styles.locationIcon,
      textStyle: [styles.textLast, styles.textValue],
      source: Images.info.location,
      alignment: 'horizontal'}, props.location),
  ]),
)

export const typeAndBoatClassCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder2 }, nothing())),
    view({ style: styles.container2 }),
    reduce(concat, nothing()),
  )([
    text({ style: styles.headline }, I18n.t('caption_regatta_details').toUpperCase()),
    inlineText( props.boatClass !== '' ? { style: styles.text } : { style: styles.textLast }, [
      text({ style: styles.textLight }, 'Style '),
      props.boatClass !== '' ? 
        text({ style: styles.textValue }, I18n.t('caption_one_design').toUpperCase()) 
      : text({ style: styles.textValue }, I18n.t('text_handicap_label').toUpperCase())
    ]),
    props.boatClass !== '' ?
    inlineText( { style: styles.textLast }, [
      text({ style: styles.textLight }, `${I18n.t('text_placeholder_boat_class')} `),
      text({ style: styles.textValue }, props.boatClass),
    ]) : nothing()
  ]),
)

export const racesAndScoringCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder3 }, nothing())),
    view({ style: styles.container3 }),
    reduce(concat, nothing()),
  )([
    text({ style: styles.headline }, I18n.t('caption_races_and_scoring').toUpperCase()),
    inlineText( { style: styles.text }, [
      text({ style: styles.textLight }, `${I18n.t('text_number_of_races')} `),
      text({ style: styles.textValue }, props.races)
    ]),
    // inlineText( { style: styles.textLast }, [
    //   text({ style: styles.textLight }, `${I18n.t('text_discard_after')} `),
    //   text({ style: styles.textValue }, props.discardRaces),
    // ]),
    styledButton({
      onPress: (props: any) => props.racesAndScoringOnPress && props.racesAndScoringOnPress(props),
    }, text({ style: styles.buttonContent }, toUpper(props.racesButtonLabel)))
  ]),
)

export const qrCode = Component((props: any) => compose(
  fold(props),
  view({ style: styles.qrCodeContainer }))(
  fromClass(QRCode).contramap((props: any) => ({
    value: props.qrCodeLink,
    size: Dimensions.get('window').width - 85,
    backgroundColor: 'white',
    quietZone: 10
  }))
))

export const inviteCompetitorsButton = Component(props => compose(
  fold(props),
  styledButton({
    onPress: (props: any) => props.inviteCompetitors && props.inviteCompetitors(props),
  }),
  text({ style: styles.buttonContent }))(
  I18n.t('caption_invite_competitors').toUpperCase()))

export const joinAsCompetitorButton = Component(props => compose(
  fold(props),
  styledButton({
    onPress: (props: any) => props.navigation.navigate(Screens.EditCompetitor, { data: props.checkIn, options: { selectSessionAfter: props.session } })
  }),
  text({ style: styles.buttonContent }))(
  I18n.t('caption_join_as_competitor').toUpperCase()))

const nothingIfCurrentUserIsCompetitor = branch(propEq('currentUserIsCompetitorForEvent', true), nothingAsClass)
const nothingIfCurrentUserIsNotCompetitor = branch(propEq('currentUserIsCompetitorForEvent', false), nothingAsClass)

export const competitorsCard = Component((props: any) =>
  compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder4 }, nothing())),
    view({ style: styles.container4 }),
    reduce(concat, nothing()))([
      text({ style: styles.headline }, I18n.t('caption_competitor').toUpperCase()),
      text({ style: styles.textLast }, I18n.t('text_info_for_invite')),
      nothingIfCurrentUserIsNotCompetitor(text({ style: styles.textLast }, I18n.t('text_user_is_competitor'))),
      inviteCompetitorsButton,
      nothingIfCurrentUserIsCompetitor(joinAsCompetitorButton),
      qrCode
    ]))
