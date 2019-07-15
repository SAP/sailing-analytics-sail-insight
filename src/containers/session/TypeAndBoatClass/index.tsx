import { compose, reduce, concat, merge, always, propEq, prop } from 'ramda'

import { navigateToNewSessionTypeAndBoatClass } from 'navigation'
import { Component, fold, nothing, reduxConnect as connect, fromClass, contramap,
  recomposeWithState as withState, recomposeBranch as branch, nothingAsClass } from 'components/fp/component'
import { field as reduxFormField, reduxForm } from 'components/fp/redux-form'
import { view, text, touchableOpacity } from 'components/fp/react-native'
import CheckBox from 'react-native-check-box'
import IconText from 'components/IconText'
import * as sessionForm from 'forms/session'
import Images from '@assets/Images'
import FormTextInput from 'components/form/FormTextInput'
import ModalDropdown from 'react-native-modal-dropdown'

const mapStateToProps = (state: any, props: any) => {
  return {}
}

const formSettings = {
  form: sessionForm.SESSION_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: false,
  keepDirtyOnReinitialize: true,
};

const withSelectedType = withState('selectedType', 'setSelectedType', 'oneDesign')
const isOneDesignSelected = propEq('selectedType', 'oneDesign')
const isHandicapSelected = propEq('selectedType', 'handicap')
const nothingIfOneDesignSelected = branch(isOneDesignSelected, nothingAsClass)
const nothingIfHandicapSelected = branch(isHandicapSelected, nothingAsClass)

const boatIcon = fromClass(IconText).contramap(always({
  source: Images.info.boat
}))

const checkbox = (label: String) => compose(
  view({}),
  reduce(concat, nothing()))([
  boatIcon,
  text({}, label),
  fromClass(CheckBox)])

const oneDesignCheckbox = checkbox('One design regatta').contramap((props: any) => ({
  isChecked: isOneDesignSelected(props),
  onClick: () => props.setSelectedType('oneDesign')
}))

const handicapCheckbox = checkbox('Handicap').contramap((props: any) => ({
  isChecked: isHandicapSelected(props),
  onClick: () => props.setSelectedType('handicap')
}))

const nextButton = Component((props: Object) => compose(
  fold(merge(props, {
    source: Images.actions.arrowRight,
    alignment: 'horizontal',
    iconPosition: 'second',
    children: 'Races & Scoring'
  })),
  touchableOpacity({
    onPress: () => navigateToNewSessionTypeAndBoatClass()
  }))(
  fromClass(IconText)));

const reviewButton = Component((props: Object) => compose(
  fold(props),
  touchableOpacity({
    onPress: () => navigateToNewSessionTypeAndBoatClass()
  }),
  contramap(merge({
    children: 'Review and create'
  })))(
  fromClass(IconText)));

const boatClassInput = reduxFormField({
  label: 'Boat class (autocomplete)',
  name: sessionForm.FORM_KEY_NAME,
  component: FormTextInput
})

const ratingSystemDropdown = fromClass(ModalDropdown).contramap(always({
  options: ['IRC', 'ORC International', 'ORC Club', 'Yardstick', 'PHRF']
}))

export default Component((props: Object) => compose(
  fold(props),
  connect(mapStateToProps),
  withSelectedType,
  reduxForm(formSettings),
  view({ style: { backgroundColor: 'red'}}),
  reduce(concat, nothing()))([
    text({}, 'Regatta Type and Boat Class'),
    oneDesignCheckbox,
    handicapCheckbox,
    nothingIfHandicapSelected(boatClassInput),
    nothingIfOneDesignSelected(ratingSystemDropdown),
    text({ style: { marginTop: 100 }}, "Additional settings are optional. Click 'Review and create' to create your event now."),
    reviewButton,
    nextButton
  ]))
