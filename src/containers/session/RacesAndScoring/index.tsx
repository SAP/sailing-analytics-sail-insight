import { __, compose, concat, map, merge, mergeLeft, reduce, range, objOf } from 'ramda'

import Slider from '@react-native-community/slider'
import { FlatList } from 'react-native'

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

const sliderSettings = {
  minimumValue: 1,
  maximumValue: 20,
  step: 1,
}

const forwardingPropsFlatList = Component(props => compose(
  fold(props))(
  fromClass(FlatList).contramap(mergeLeft({
    renderItem: item => props.renderItem({...props, ...item })
  }))))

const raceNumberSelector = Component((props: any) =>
  compose(
    fold(props),
    reduce(concat, nothing()),
  )([
    text({}, 'Planned number of races'),
    fromClass(Slider).contramap(merge({
      value: props.input.value,
      onValueChange: props.input.onChange
    })),
    text({}, `${props.input.value}`),
  ]),
)

const raceNumberFormField = reduxFormField({
  name: sessionForm.FORM_KEY_RACE_NUMBER,
  component: raceNumberSelector.fold,
  ...sliderSettings,
})

const scoringSystemLabel = Component((props: object) => compose(
  fold(props),
  reduce(concat, nothing()),
  map(text({})))([
  'Low point scoring applies',
  'Please contact us if you require any other scoring system.'
]))

const discardSelectorItem = Component((props: any) => compose(
  fold(props),
  touchableOpacity({
    style: {
      height: 100,
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: props.item.key == props.input.value ? '#2699FB' : '#F1F9FF',
      margin: 10,
    },
    onPress: () => props.input.onChange(props.item.key)
  }),
  text({}))(
  props.item.key))

const discardInputFormField = reduxFormField({
  name: sessionForm.FORM_KEY_DISCARD_START,
  data: map(objOf('key'), range(1, 7)),
  component: forwardingPropsFlatList.fold,
  renderItem: discardSelectorItem.fold,
  showsHorizontalScrollIndicator: false,
  horizontal: true,
})

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
  },
})

export default Component((props: Object) => compose(
  fold(props),
  connect(mapStateToProps),
  reduxForm(formSettings),
  view({ style: [] }),
  reduce(concat, nothing()))([
    text({}, 'Races & Scoring'),
    raceNumberFormField,
    scoringSystemLabel,
    text({}, 'Discards starting from ... races'),
    discardInputFormField,
    nextButton,
  ]))
