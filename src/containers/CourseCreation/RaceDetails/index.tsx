import { __, compose, concat, map, merge, defaultTo,
  reduce, when, uncurryN, tap, always, isNil, unless,
  prop, isEmpty } from 'ramda'

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
import { forwardingPropsFlatList, text, view, touchableOpacity } from 'components/fp/react-native'

import IconText from 'components/IconText'
import { overlayPicker, FramedNumber } from '../../session/common'

import { selectCourse } from 'actions/courses'
import { selectRace, setRaceTime, updateEventSettings } from 'actions/events'
import { getRegattaPlannedRaces, getSelectedRegatta } from 'selectors/regatta'
import { getCourseStateById } from 'selectors/course'
import { getRaceTime } from 'selectors/event'
import { navigateToRaceCourseLayout } from 'navigation'

import DatePicker from 'react-native-datepicker'

import { dateTimeShortHourText } from 'helpers/date'
import styles from './styles'

export const arrowRight = fromClass(IconText).contramap(merge({
  source: Images.actions.arrowRight,
  style: { justifyContent: 'center' } }))

const getRegattaPlannedRacesN = uncurryN(2, getRegattaPlannedRaces)

const mapStateToProps = (state: any, props: any) => {
  const { leaderboardName } = getCustomScreenParamData(props)
  const session = getSession(leaderboardName)(state)

  const races = compose(
    map((raceName: string) => ({
      raceName,
      courseDefined: !!getCourseStateById(`${session.regattaName} - ${raceName}`)(state),
      raceTime: getRaceTime(leaderboardName, raceName)(state)
    })),
    getRegattaPlannedRacesN(__, state),
    getSelectedRegatta)(
    state)

  return {
    session,
    numberOfRaces: races.length,
    races
  }
}

const raceNumberSelector = Component((props: any) =>
  compose(
    fold(props),
    concat(text({ style: styles.textHeader }, 'Planned number of races')),
    view({ style: styles.raceNumberContainer }),
    overlayPicker({
      style: { position: 'absolute', top: 0, width: 160, height: 80, color: 'white' },
      selectedValue: props.numberOfRaces,
      onValueChange: v => props.updateEventSettings(props.session, { numberOfRaces: v })
    }))(
    FramedNumber.contramap(always({ value: props.numberOfRaces }))))

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
    raceNumberSelector,
    text({}, 'Discards starting from ... races')]))

export default Component((props: Object) =>
  compose(
    fold(props),
    connect(mapStateToProps, { selectCourse, selectRace, setRaceTime, updateEventSettings }),
    view({ style: styles.mainContainer }),
    reduce(concat, nothing()))
  ([detailsContainer,
    raceList ]))
