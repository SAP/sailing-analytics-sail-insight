import { __, always, compose, concat, curry, map, merge, reduce } from 'ramda'

import React from 'react'
import { FlatList, Text, TouchableOpacity } from 'react-native'
import Slider from '@react-native-community/slider'

import I18n from 'i18n'

import Images from '@assets/Images'
import {
  Component,
  fold,
  fromClass,
  nothing,
  reduxConnect as connect,
} from 'components/fp/component'
import { text, touchableOpacity, view } from 'components/fp/react-native'
import { field as reduxFormField, reduxForm } from 'components/fp/redux-form'
import IconText from 'components/IconText'
import * as sessionForm from 'forms/session'
import { navigateToNewSessionTypeAndBoatClass } from 'navigation'

const formSettings = {
  form: sessionForm.SESSION_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: false,
  keepDirtyOnReinitialize: true,
}

const SliderControlled = Component((props: any) => compose(
  fold(props),
  fromClass(Slider).contramap,
  merge,
  merge(__, {
    value: props.input.value,
    onValueChange: props.input.onChange,
  }),
)({}))

const sliderSettings = {
  minimumValue: 1,
  maximumValue: 20,
  step: 1,
}

const raceNumberSelector = Component((props: any) =>
  compose(
    fold(props),
    reduce(concat, nothing()),
  )([
    text({}, 'Planned number of races'),
    SliderControlled,
    text({}, `${props.input.value}`),
  ]),
)

const raceNumberSelectorConnected = reduxFormField({
  name: sessionForm.FORM_KEY_RACE_NUMBER,
  component: raceNumberSelector.fold,
  ...sliderSettings
})

const scoringSystemLabel = Component((props: object) => compose(
  fold(props),
  reduce(concat, nothing()),
  map(text({}))
)([
  'Low point scoring applies',
  'Please contact us if you require any other scoring system.'
]))


const flatList = (settings: object) => Component((props: any) => compose(
  fold(props),
  fromClass(FlatList).contramap,
  merge,
  merge(__, { renderItem: settings.renderItem(props) }),
  merge(settings),
)(settings))

const horizontalPickerItem = curry((props: any, { item }: any) => (
  <TouchableOpacity
    style={{
      height: 100,
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: item.key == props.input.value ? '#2699FB' : '#F1F9FF',
      margin: 10,
    }}
    onPress={() => props.input.onChange(item.key)}
  >
    <Text
      style={{
        color: item.key == props.input.value ? '#FFFFFF' : '#2699FB',
      }}
    >
      {item.key}
    </Text>
  </TouchableOpacity>
))

const discardHorizontalPicker = flatList({
  data: [{ key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }, { key: 6 }, { key: 7 }],
  renderItem: horizontalPickerItem,
  showsHorizontalScrollIndicator: false,
  horizontal: true,
})

const discardInput = reduxFormField({
  name: sessionForm.FORM_KEY_DISCARD_START,
  component: discardHorizontalPicker.fold,
})

const discardSelector = Component((props: object) =>
  compose(
    fold(props),
    reduce(concat, nothing()),
  )([
    text({}, 'Discards starting from ... races'),
    discardInput,
  ]),
)

const nextButton = Component((props: Object) => compose(
  fold(props),
  touchableOpacity({
    onPress: () => navigateToNewSessionTypeAndBoatClass(),
  }))(
    fromClass(IconText).contramap(merge({
      source: Images.actions.arrowRight,
      alignment: 'horizontal',
      iconPosition: 'second',
      children: 'Competitors',
    })),
  ))

const mapStateToProps = (state: any) => ({
  initialValues: {
    [sessionForm.FORM_KEY_RACE_NUMBER]: 3,
    [sessionForm.FORM_KEY_DISCARD_START]: 3,
  }
})

export default Component((props: Object) => compose(
  fold(props),
  connect(mapStateToProps),
  reduxForm(formSettings),
  view({ style: [] }),
  reduce(concat, nothing()))([
    text({}, 'Races & Scoring'),
    raceNumberSelectorConnected,
    scoringSystemLabel,
    discardSelector,
    nextButton,
  ]))
