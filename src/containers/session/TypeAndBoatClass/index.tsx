import { findIndex } from 'lodash'
import {  always, compose, concat, mergeLeft, propEq, reduce, when, gt, __, merge, tap } from 'ramda'

import { Component, fold, fromClass, nothing, nothingAsClass,
  recomposeBranch as branch } from 'components/fp/component'
import { text, view } from 'components/fp/react-native'
import { field as reduxFormField } from 'components/fp/redux-form'

import FormBoatClassInput from 'components/form/FormBoatClassInput'
import {
  FORM_KEY_BOAT_CLASS,
  FORM_KEY_REGATTA_TYPE,
} from 'forms/eventCreation'
import { RegattaType } from 'models/EventCreationData'
import ModalDropdown from 'react-native-modal-dropdown'
import SwitchSelector from 'react-native-switch-selector'

import { $MediumBlue, $primaryActiveColor } from 'styles/colors'
import styles from './styles'

const isOneDesignSelected = propEq('regattaType', RegattaType.OneDesign)
const isHandicapSelected = propEq('regattaType', RegattaType.Handicap)
const nothingIfOneDesignSelected = branch(isOneDesignSelected, nothingAsClass)

const regattaTypeOptions = [
  { label: 'ONE DESIGN', value: RegattaType.OneDesign },
  { label: 'HANDICAP', value: RegattaType.Handicap },
]

const regattaTypeSelector = fromClass(SwitchSelector).contramap((props: any) => ({
  options: regattaTypeOptions,
  initial: when(gt(0), always(0))(
    findIndex(regattaTypeOptions, ['value', props.input.value]),
  ),
  onPress: props.input.onChange,
  backgroundColor: $MediumBlue,
  selectedColor: 'white',
  buttonColor: $primaryActiveColor,
  textColor: 'white',
  borderColor: 'white',
  borderRadius: 5,
  hasPadding: true,
  height: 55,
  textStyle: styles.regattaTypeSelectorText,
  selectedTextStyle: styles.regattaTypeSelectorText,
  style: styles.switchSelector
}))

const regattaTypeInput = reduxFormField({
  name: FORM_KEY_REGATTA_TYPE,
  component: regattaTypeSelector.fold,
})

const boatClassInput = Component(props => compose(
  fold(props))(
  reduxFormField({
    name: FORM_KEY_BOAT_CLASS,
    style: styles.boatClassInput,
    label: 'Boat class',
    component: FormBoatClassInput
  })))

const modalDropdown = fromClass(ModalDropdown).contramap((props: any) => mergeLeft({
  onSelect: (index: any, value: any) => props.input.onChange(value),
  defaultValue: props.input.value,
  defaultIndex: props.options.indexOf(props.input.value),
}, props))

// const ratingSystemDropdown = reduxFormField({
//   name: FORM_KEY_RATING_SYSTEM,
//   component: modalDropdown.fold,
//   options: Object.values(HandicapRatingSystem),
// })

export default Component((props: Object) =>
  compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder }, nothing())),
    view({ style: styles.container }),
    reduce(concat, nothing()))([
      text({ style: styles.sectionHeaderStyle }, 'REGATTA DETAILS'),
      regattaTypeInput,
      // No recompose higher order function here as it interferes with the
      // already delicate interop between redux-form and functional component monad 
      props.regattaType === RegattaType.OneDesign ? boatClassInput : nothing(),
      // nothingIfOneDesignSelected(ratingSystemDropdown),
    ]))
