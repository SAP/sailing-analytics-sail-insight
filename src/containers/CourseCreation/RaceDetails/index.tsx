import { __, compose, concat, map, merge, defaultTo, reduce, objOf } from 'ramda'

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

import { fetchCourse, selectCourse } from 'actions/courses'
import { selectRace } from 'actions/events'
import { getRegattaPlannedRaces, getSelectedRegatta } from 'selectors/regatta'
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
    },
    races: getRegattaPlannedRaces(getSelectedRegatta(state))(state)
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

const onSeeCourse = (props: any) => {
  const { raceName } = props.item
  props.selectCourse({ raceName, newCourse: false })
  navigateToRaceCourseLayout()
}

const onNewCourse = (props: any) => {
  const { raceName } = props.item
  props.selectCourse({ raceName, newCourse: true })
  navigateToRaceCourseLayout()
}

const DefineLayoutButton = Component(props =>
  compose(
    fold(props),
    touchableOpacity({
      onPress: () => props.item.courseDefined ? onSeeCourse(props) : onNewCourse(props)
    }))(
    text({}, props.item.courseDefined ? 'See Layout' : 'Define Layout')))

const RaceItem = Component(props =>
  compose(
    fold(props),
    view({ style: { flex: 1, flexDirection: 'row' }}),
    reduce(concat, nothing()))
  ([
    text({}, defaultTo('', props.item.raceName)),
    fromClass(IconText).contramap(merge({ source: Images.info.time })),
    text({}, defaultTo('', props.item.startDate)),
    DefineLayoutButton,
    ArrowRight ]))

const raceList = forwardingPropsFlatList.contramap((props: any) =>
  merge({
    data: map(objOf('raceName'), props.races),
    renderItem: RaceItem.fold,
  }, props))

export default Component((props: Object) =>
  compose(
    fold(props),
    connect(mapStateToProps, { fetchCourse, selectCourse, selectRace }),
    reduxForm(eventWizardCommonFormSettings),
    view({ style: [] }),
    reduce(concat, nothing()))
  ([
    text({}, 'Number of Races'),
    raceNumberFormField,
    text({}, 'Discards starting from ... races'),
    raceList ]))
