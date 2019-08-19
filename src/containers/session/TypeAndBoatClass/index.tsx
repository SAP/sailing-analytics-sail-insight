import {  always, compose, concat, mergeLeft, propEq, reduce } from 'ramda'

import Images from '@assets/Images'
import FormTextInput from 'components/form/FormTextInput'
import { Component, fold, fromClass, nothing, nothingAsClass,
  recomposeBranch as branch } from 'components/fp/component'
import { text, view } from 'components/fp/react-native'
import { field as reduxFormField } from 'components/fp/redux-form'
import IconText from 'components/IconText'
import {
  FORM_KEY_BOAT_CLASS,
  FORM_KEY_RATING_SYSTEM,
  FORM_KEY_REGATTA_TYPE,
} from 'forms/eventCreation'
import {
  HandicapRatingSystem,
  RegattaType,
} from 'models/EventCreationData'
import CheckBox from 'react-native-check-box'
import ModalDropdown from 'react-native-modal-dropdown'



const isOneDesignSelected = propEq('regattaType', RegattaType.OneDesign)
const isHandicapSelected = propEq('regattaType', RegattaType.Handicap)
const nothingIfOneDesignSelected = branch(isOneDesignSelected, nothingAsClass)
const nothingIfHandicapSelected = branch(isHandicapSelected, nothingAsClass)

const boatIcon = fromClass(IconText).contramap(always({
  source: Images.info.boat,
}))

const checkbox = (label: string, value: any) =>
  Component((props: any) =>
    compose(
      fold(props),
      view({}),
      reduce(concat, nothing()))
    ([
      boatIcon,
      text({}, label),
      fromClass(CheckBox).contramap(mergeLeft({
        isChecked: props.input.value === value,
        onClick: () => props.input.onChange(value),
      }))]))

const regattaTypeCheckbox = (...args: any) => reduxFormField({
  name: FORM_KEY_REGATTA_TYPE,
  component: checkbox(...args).fold,
})

const oneDesignCheckbox = regattaTypeCheckbox('One design regatta', RegattaType.OneDesign)
const handicapCheckbox = regattaTypeCheckbox('Handicap', RegattaType.Handicap)

const boatClassInput = reduxFormField({
  label: 'Boat class (autocomplete)',
  name: FORM_KEY_BOAT_CLASS,
  component: FormTextInput,
})

const modalDropdown = fromClass(ModalDropdown).contramap((props: any) => mergeLeft({
  onSelect: (index: any, value: any) => props.input.onChange(value),
  defaultValue: props.input.value,
  defaultIndex: props.options.indexOf(props.input.value),
}, props))

const ratingSystemDropdown = reduxFormField({
  name: FORM_KEY_RATING_SYSTEM,
  component: modalDropdown.fold,
  options: Object.values(HandicapRatingSystem),
})

export default Component((props: Object) =>
  compose(
    fold(props),
    view({ style: { backgroundColor: 'red' } }),
    reduce(concat, nothing()))([
      text({}, 'Regatta Type and Boat Class'),
      oneDesignCheckbox,
      handicapCheckbox,
      nothingIfHandicapSelected(boatClassInput),
      nothingIfOneDesignSelected(ratingSystemDropdown),
      text({ style: { marginTop: 100 } }, "Additional settings are optional. Click 'Review and create' to create your event now."),
    ]))
