import {  compose, reduce, concat, mergeLeft, always, propEq } from 'ramda'

import { navigateToNewSessionsRacesAndScoring } from 'navigation'
import { Component, fold, nothing, reduxConnect as connect, fromClass,
  recomposeBranch as branch, nothingAsClass } from 'components/fp/component'
import { field as reduxFormField, reduxForm } from 'components/fp/redux-form'
import { view, text } from 'components/fp/react-native'
import CheckBox from 'react-native-check-box'
import IconText from 'components/IconText'
import { nextButton, reviewButton } from 'containers/session/common'
import {
  EVENT_CREATION_FORM_NAME,
  eventWizardCommonFormSettings,
  FORM_KEY_BOAT_CLASS,
  FORM_KEY_REGATTA_TYPE,
} from 'forms/eventCreation'
import Images from '@assets/Images'
import FormTextInput from 'components/form/FormTextInput'
import ModalDropdown from 'react-native-modal-dropdown'

import { getFormFieldValue } from 'selectors/form'

const mapStateToProps = (state: any, props: any) => {
  return {
    regattaType: getFormFieldValue(EVENT_CREATION_FORM_NAME, FORM_KEY_REGATTA_TYPE)(state)
  }
}

const isOneDesignSelected = propEq('regattaType', 'oneDesign')
const isHandicapSelected = propEq('regattaType', 'handicap')
const nothingIfOneDesignSelected = branch(isOneDesignSelected, nothingAsClass)
const nothingIfHandicapSelected = branch(isHandicapSelected, nothingAsClass)

const boatIcon = fromClass(IconText).contramap(always({
  source: Images.info.boat
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
      })) ]))

const regattaTypeCheckbox = (...args: any) => reduxFormField({
  name: FORM_KEY_REGATTA_TYPE,
  component: checkbox(...args).fold
})

const oneDesignCheckbox = regattaTypeCheckbox('One design regatta', 'oneDesign')
const handicapCheckbox = regattaTypeCheckbox('Handicap', 'handicap')

const boatClassInput = reduxFormField({
  label: 'Boat class (autocomplete)',
  name: FORM_KEY_BOAT_CLASS,
  component: FormTextInput
})

const ratingSystemDropdown = fromClass(ModalDropdown).contramap(always({
  options: ['IRC', 'ORC International', 'ORC Club', 'Yardstick', 'PHRF']
}))

export default Component((props: Object) =>
  compose(
    fold(props),
    connect(mapStateToProps),
    reduxForm(eventWizardCommonFormSettings),
    view({ style: { backgroundColor: 'red'}}),
    reduce(concat, nothing()))
  ([
    text({}, 'Regatta Type and Boat Class'),
    oneDesignCheckbox,
    handicapCheckbox,
    nothingIfHandicapSelected(boatClassInput),
    nothingIfOneDesignSelected(ratingSystemDropdown),
    text({ style: { marginTop: 100 }}, "Additional settings are optional. Click 'Review and create' to create your event now."),
    reviewButton,
    nextButton(navigateToNewSessionsRacesAndScoring, 'Races & Scoring') ]))
