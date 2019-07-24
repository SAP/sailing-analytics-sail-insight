import { __, compose, concat, map, merge, mergeLeft, reduce, range, objOf } from 'ramda'

import { getCustomScreenParamData } from 'navigation/utils'
import { getSession } from 'selectors/session'

import Slider from '@react-native-community/slider'
import Images from '@assets/Images'

import I18n from 'i18n'

import {
  Component,
  fold,
  fromClass,
  nothing,
  reduxConnect as connect
} from 'components/fp/component'
import { field as reduxFormField, reduxForm } from 'components/fp/redux-form'
import { forwardingPropsFlatList, text, view, touchableOpacity } from 'components/fp/react-native'
import {
  eventWizardCommonFormSettings,
  FORM_KEY_NUMBER_OF_RACES,
} from 'forms/eventCreation'

import { ArrowRight } from 'containers/session/common'
import IconText from 'components/IconText'

import { navigateToRaceCourseLayout, navigateToRaceSetup } from 'navigation'

const sliderSettings = {
  minimumValue: 1,
  maximumValue: 20,
  step: 1,
}

const mapStateToProps = (state: any, props: any) => {
  const { leaderboardName } = getCustomScreenParamData(props)
  const session = getSession(leaderboardName)(state)

  return {
    session,
    initialValues: {
      [FORM_KEY_NUMBER_OF_RACES]: session.regatta && session.regatta.races.length
    }
  }
}

const raceNumberSelector = Component((props: any) =>
  compose(
    fold(props),
    reduce(concat, nothing()))
  ([
    text({}, 'Planned number of races'),
    fromClass(Slider).contramap(merge({
      value: Number(props.input.value),
      onValueChange: props.input.onChange
    })),
    text({}, `${props.input.value}`) ]))

const raceNumberFormField = reduxFormField({
  name: FORM_KEY_NUMBER_OF_RACES,
  component: raceNumberSelector.fold,
  ...sliderSettings,
})

const DefineLayoutButton = Component(props =>
  compose(
    fold(props),
    touchableOpacity({
      onPress: () => props.item.courseDefined ? navigateToRaceCourseLayout() : navigateToRaceSetup()
    }))(
    text({}, props.item.courseDefined ? 'See Layout' : 'Define Layout')))

const RaceItem = Component(props =>
  compose(
    fold(props),
    view({ style: { flex: 1, flexDirection: 'row' }}),
    reduce(concat, nothing()))
  ([
    text({}, props.item.name),
    fromClass(IconText).contramap(merge({ source: Images.info.time })),
    text({}, props.item.startDate),
    DefineLayoutButton,
    ArrowRight ]))

const raceList = forwardingPropsFlatList.contramap(
  merge({
    data: [
      { name: 'R1', startDate: '08:30', courseDefined: false },
      { name: 'R2', startDate: '09:30', courseDefined: true },
      { name: 'R3', startDate: '10:30', courseDefined: true },
    ],
    renderItem: RaceItem.fold,
  }),
)

export default Component((props: Object) =>
  compose(
    fold(props),
    connect(mapStateToProps),
    reduxForm(eventWizardCommonFormSettings),
    view({ style: [] }),
    reduce(concat, nothing()))
  ([
    text({}, 'Number of Races'),
    raceNumberFormField,
    text({}, 'Discards starting from ... races'),
    raceList ]))
