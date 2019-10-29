import { __, compose, concat, map, merge, defaultTo,
  reduce, when, uncurryN, tap, always, isNil, unless,
  prop } from 'ramda'

import { getCustomScreenParamData } from 'navigation/utils'
import { getSession } from 'selectors/session'
import moment from 'moment/min/moment-with-locales'

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
  FORM_KEY_NUMBER_OF_RACES,
  EVENT_CREATION_FORM_NAME
} from 'forms/eventCreation'

import IconText from 'components/IconText'
import { overlayPicker, FramedNumber } from '../../session/common'

import { selectCourse } from 'actions/courses'
import { selectRace, setRaceTime } from 'actions/events'
import { getRegattaPlannedRaces, getSelectedRegatta } from 'selectors/regatta'
import { getCourseStateById } from 'selectors/course'
import { getRaceTime } from 'selectors/event'
import { navigateToRaceCourseLayout, navigateToRaceSetup } from 'navigation'

import DatePicker from 'react-native-datepicker'

import { dateTimeShortHourText } from 'helpers/date'
import styles from './styles'

const sliderSettings = {
  minimumValue: 1,
  maximumValue: 20,
  step: 1,
}

export const arrowRight = fromClass(IconText).contramap(merge({
  source: Images.actions.arrowRight,
  style: { justifyContent: 'center' } }))

const getRegattaPlannedRacesN = uncurryN(2, getRegattaPlannedRaces)

const mapStateToProps = (state: any, props: any) => {
  const { leaderboardName } = getCustomScreenParamData(props)
  const session = getSession(leaderboardName)(state)

  return {
    session,
    initialValues: {
      [FORM_KEY_NUMBER_OF_RACES]: session.regatta && session.regatta.races.length
    },
    races: compose(
      map((raceName: string) => ({
        raceName,
        courseDefined: !!getCourseStateById(`${session.regattaName} - ${raceName}`)(state),
        raceTime: getRaceTime(leaderboardName, raceName)(state)
      })),
      getRegattaPlannedRacesN(__, state),
      getSelectedRegatta)(
      state)
  }
}

const raceNumberSelector = Component((props: any) =>
  compose(
    fold(props),
    concat(text({ style: styles.textHeader }, 'Planned number of races')),
    view({ style: styles.raceNumberContainer }),
    overlayPicker({
      style: { position: 'absolute', top: 0, width: 160, height: 80, color: 'white' },
      selectedValue: Number(props.input.value),
      onValueChange: props.input.onChange,
    }))(
    FramedNumber.contramap(always({ value: props.input.value }))))

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

const defineLayoutButton = Component(props =>
  compose(
    fold(props),
    touchableOpacity({
      onPress: () => props.item.courseDefined ? onSeeCourse(props) : onNewCourse(props)
    }))(
    text({}, props.item.courseDefined ? 'See Layout' : 'Define Layout')))

const raceTime = Component((props: object) => compose(
  fold(props),
  view({ style: [styles.raceTimeContainer, props.item.raceTime.startTimeAsMillis && styles.raceTimeContainerWithTime] }),
  concat(__, fromClass(DatePicker).contramap(always({
    onDateChange: (value: number) => props.setRaceTime({
      race: props.item.raceName,
      raceTime: props.item.raceTime,
      value
    }),
    date: moment(props.item.raceTime.startTimeAsMillis || new Date()),
    androidMode: 'spinner',
    mode: 'time',
    hideText: true,
    showIcon: false,
    style: {position: 'absolute', width: 100, height: 60, top: 0, left: 0 },
    customStyles: {
      dateInput: {
        height: 60,
        width: 100,
        borderWidth: 0,
      }
    },
  }))),
  concat(fromClass(IconText).contramap(merge({ source: Images.info.time, iconStyle: { tintColor: 'white' }}))),
  text({ style: [styles.raceTimeText, props.item.raceTime.startTimeAsMillis && styles.raceTimeTextSet] }),
  when(isNil, always('Set time')),
  unless(isNil, dateTimeShortHourText))(
  props.item.raceTime.startTimeAsMillis))

const raceItem = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.raceItemContainer }),
    reduce(concat, nothing()))
  ([
    raceTime,
    text({ style: styles.raceNameText }, defaultTo('', props.item.raceName)),
    defineLayoutButton,
    arrowRight ]))

const raceList = Component((props: object) => compose(
  fold(props),
  view({ style: styles.racesListContainer }))(
  forwardingPropsFlatList.contramap((props: any) =>
    merge({
      data: props.races,
      renderItem: raceItem.fold
    }, props))))

const detailsContainer = Component((props: Object) =>
  compose(
    fold(props),
    view({ style: styles.detailsContainer }),
    reduce(concat, nothing()))
  ([
    text({ style: styles.sectionHeaderStyle }, 'LIST OF RACES'),
    raceNumberFormField,
    text({}, 'Discards starting from ... races')]))

export default Component((props: Object) =>
  compose(
    fold(props),
    connect(mapStateToProps, { selectCourse, selectRace, setRaceTime }),
    reduxForm({ form: EVENT_CREATION_FORM_NAME }),
    view({ style: styles.mainContainer }),
    reduce(concat, nothing()))
  ([detailsContainer,
    raceList ]))
