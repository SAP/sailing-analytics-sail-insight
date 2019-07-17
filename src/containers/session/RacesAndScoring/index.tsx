import { compose, concat, map, merge, reduce, prop, path } from 'ramda'

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

const raceNumberInput = reduxFormField({
  name: sessionForm.FORM_KEY_RACE_NUMBER,
  component: Slider,
})

const raceNumberSelector = Component((props: object) =>
  compose(
    fold(props),
    reduce(concat, nothing()),
  )([
    text({}, 'Planned number of races'),
    raceNumberInput,
  ]))

const scoringSystemLabel = Component((props: object) => compose(
  fold(props),
  reduce(concat, nothing()),
  map(text({}))
)([
  'Low point scoring applies',
  'Please contact us if you require any other scoring system.'
]))

const horizontalPickerItem = Component(props => compose(
  fold(props),
  touchableOpacity({
    style: {
      height: 100,
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: '#F1F9FF',
      margin: 10,
    },
    onPress: item => console.log(item)
  }),
  text({}),
  path(['item', 'key']))(
  props))

const discardHorizontalPicker = fromClass(FlatList).contramap(merge({
  data: [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }, { key: 6 }],
  renderItem: horizontalPickerItem.fold,
  showsHorizontalScrollIndicator: false,
  horizontal: true,
}))

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

export default Component((props: Object) => compose(
  fold(props),
  connect(),
  reduxForm(formSettings),
  view({ style: [] }),
  reduce(concat, nothing()))([
    text({}, 'Races & Scoring'),
    raceNumberSelector,
    scoringSystemLabel,
    discardSelector,
    nextButton,
  ]))
