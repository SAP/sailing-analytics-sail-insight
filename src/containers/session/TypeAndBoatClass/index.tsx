import {  compose, reduce, concat, mergeLeft, always, propEq } from 'ramda'

import {
  navigateToNewSessionReviewAndCreate,
  navigateToNewSessionsRacesAndScoring,
} from 'navigation'
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
  FORM_KEY_RATING_SYSTEM,
  validateTypeAndBoatClass,
} from 'forms/eventCreation'
import {
  RegattaType,
  HandicapRatingSystem,
} from 'models/EventCreationData'
import Images from '@assets/Images'
import FormTextInput from 'components/form/FormTextInput'
import ModalDropdown from 'react-native-modal-dropdown'

import { getFormFieldValue } from 'selectors/form'

const mapStateToProps = (state: any, props: any) => {
  return {
    regattaType: getFormFieldValue(EVENT_CREATION_FORM_NAME, FORM_KEY_REGATTA_TYPE)(state)
  }
}

const isOneDesignSelected = propEq('regattaType', RegattaType.OneDesign)
const isHandicapSelected = propEq('regattaType', RegattaType.Handicap)
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

const oneDesignCheckbox = regattaTypeCheckbox('One design regatta', RegattaType.OneDesign)
const handicapCheckbox = regattaTypeCheckbox('Handicap', RegattaType.Handicap)

const boatClassInput = reduxFormField({
  label: 'Boat class (autocomplete)',
  name: FORM_KEY_BOAT_CLASS,
  component: FormTextInput
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

const formSettings = {
  ...eventWizardCommonFormSettings,
  onSubmit: navigateToNewSessionsRacesAndScoring,
  validate: validateTypeAndBoatClass,
}

export default Component((props: Object) =>
  compose(
    fold(props),
    connect(mapStateToProps),
    reduxForm(formSettings),
    view({ style: { backgroundColor: 'red'}}),
    reduce(concat, nothing()))
  ([
    text({}, 'Regatta Type and Boat Class'),
    oneDesignCheckbox,
    handicapCheckbox,
    nothingIfHandicapSelected(boatClassInput),
    nothingIfOneDesignSelected(ratingSystemDropdown),
    text({ style: { marginTop: 100 }}, "Additional settings are optional. Click 'Review and create' to create your event now."),
    reviewButton({
      onPress: (props: any) => props.handleSubmit(navigateToNewSessionReviewAndCreate)()
    }),
    nextButton({
      onPress: (p: any) => p.handleSubmit(),
      label: 'Races & Scoring'
    }) ]))
