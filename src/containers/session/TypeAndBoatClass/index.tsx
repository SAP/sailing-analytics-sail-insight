import { compose, reduce, concat, merge, always, propEq } from 'ramda'

import I18n from 'i18n'

import { navigateToNewSessionTypeAndBoatClass } from 'navigation'
import { Component, fold, nothing, reduxConnect as connect, fromClass, contramap,
  recomposeWithState as withState } from 'components/fp/component'
import { field as reduxFormField, reduxForm } from 'components/fp/redux-form'
import { view, text, touchableOpacity } from 'components/fp/react-native'
import CheckBox from 'react-native-check-box'
import IconText from 'components/IconText'
import * as sessionForm from 'forms/session'
import Images from '@assets/Images'

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

export default Component((props: Object) => compose(
  fold(props),
  connect(mapStateToProps),
  withSelectedType,
  reduxForm(formSettings),
  view({ style: []}),
  reduce(concat, nothing()))([
    text({}, 'Regatta Type and Boat Class'),
    oneDesignCheckbox,
    handicapCheckbox,
    text({}, "Additional settings are optional. Click 'Review and create' to create your event now."),
    reviewButton,
    nextButton
  ]))
