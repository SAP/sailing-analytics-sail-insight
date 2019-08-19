import { __, compose, concat, map, merge, objOf, range, reduce } from 'ramda'

import Slider from '@react-native-community/slider'

import {
  Component,
  fold,
  fromClass,
  nothing,
} from 'components/fp/component'
import { forwardingPropsFlatList, text, touchableOpacity, view } from 'components/fp/react-native'
import { field as reduxFormField } from 'components/fp/redux-form'
import {
  FORM_KEY_DISCARDS_START,
  FORM_KEY_NUMBER_OF_RACES,
} from 'forms/eventCreation'

const sliderSettings = {
  minimumValue: 1,
  maximumValue: 20,
  step: 1,
}

const raceNumberSelector = Component((props: any) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
      text({}, 'Planned number of races'),
      fromClass(Slider).contramap(merge({
        value: Number(props.input.value),
        onValueChange: props.input.onChange,
      })),
      text({}, `${props.input.value}`)]))

const raceNumberFormField = reduxFormField({
  name: FORM_KEY_NUMBER_OF_RACES,
  component: raceNumberSelector.fold,
  ...sliderSettings,
})

const scoringSystemLabel = Component((props: object) =>
  compose(
    fold(props),
    reduce(concat, nothing()),
    map(text({})))([
      'Low point scoring applies',
      'Please contact us if you require any other scoring system.']))

const discardSelectorItem = Component((props: any) =>
  compose(
    fold(props),
    touchableOpacity({
      style: {
        height: 100,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: props.item.key === props.input.value ? '#2699FB' : '#F1F9FF',
        margin: 10,
      },
      onPress: () => props.input.onChange(props.item.key),
    }),
    text({}))(props.item.key))

const discardInputFormField = reduxFormField({
  name: FORM_KEY_DISCARDS_START,
  data: map(objOf('key'), range(1, 7)),
  component: forwardingPropsFlatList.fold,
  renderItem: discardSelectorItem.fold,
  showsHorizontalScrollIndicator: false,
  horizontal: true,
})

export default Component((props: Object) =>
  compose(
    fold(props),
    view({ style: [] }),
    reduce(concat, nothing()))([
      text({}, 'Races & Scoring'),
      raceNumberFormField,
      scoringSystemLabel,
      text({}, 'Discards starting from ... races'),
      discardInputFormField,
    ]))
