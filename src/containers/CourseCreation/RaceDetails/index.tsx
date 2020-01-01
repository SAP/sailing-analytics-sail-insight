import { __, compose, concat, map, merge, defaultTo,
  reduce, when, uncurryN, tap, always, isNil, unless,
  prop, isEmpty, not } from 'ramda'
import { openTrackDetails } from 'actions/navigation'
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
import { getCourseById } from 'selectors/course'
import { getRaceTime, getSelectedEventInfo } from 'selectors/event'
import { nothingIfCannotUpdateCurrentEvent, nothingIfCanUpdateCurrentEvent } from 'components/helpers'
import DatePicker from 'react-native-datepicker'
import { dateTimeShortHourText, dateShortText } from 'helpers/date'
import styles from './styles'

export const arrowRight = fromClass(IconText).contramap(merge({
  source: Images.actions.arrowRight,
  style: { justifyContent: 'center' } }))

const getRegattaPlannedRacesN = uncurryN(2, getRegattaPlannedRaces)

const mapStateToProps = (state: any, props: any) => {
  const { leaderboardName, regattaName } = getSelectedEventInfo(state)
  const session = getSession(leaderboardName)(state)

  const races = compose(
    map((name: string) => ({
      name,
      regattaName,
      courseDefined: compose(
        not,
        isEmpty,
        defaultTo({}),
        prop('waypoints'),
        getCourseById(`${session.regattaName} - ${name}`))(
        state),
      raceTime: getRaceTime(leaderboardName, name)(state)
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
      selectedValue: props.numberOfRaces,
      onValueChange: v => props.updateEventSettings(props.session, { numberOfRaces: v })
    }))(
    FramedNumber.contramap(always({ value: props.numberOfRaces }))))

const onSeeCourse = (props: any) => {
  const { name } = props.item
  props.selectCourse({ race: name })
}

const defineLayoutButton = Component((props: any) =>
  compose(
    fold(props),
    touchableOpacity({
      style: { flexGrow: 1 },
      onPress: () => onSeeCourse(props)
    }))(
    text({}, props.item.courseDefined ? 'See Course' : 'Define Course')))

const raceAnalyticsButton = Component((props: any) =>
  compose(
    fold(props),
    touchableOpacity({
      onPress: () => props.openTrackDetails(props.item)
    }))(
    text({}, 'SAP Analytics')))

const getRaceStartTime = compose(
  prop('startTimeAsMillis'),
  defaultTo({}),
  prop('raceTime'))

const raceTimePicker = Component((props: any) => compose(
  fold(props),
  view({ style: [styles.raceTimeContainer, getRaceStartTime(props.item) && styles.raceTimeContainerWithTime] }),
  concat(__, fromClass(DatePicker).contramap(always({
    onDateChange: (value: number) => props.setRaceTime({
      race: props.item.name,
      raceTime: props.item.raceTime,
      value
    }),
    date: moment(getRaceStartTime(props.item) || new Date()),
    androidMode: 'spinner', 
    mode: 'time',
    confirmBtnText: I18n.t('caption_confirm'),
    cancelBtnText: I18n.t('caption_cancel'),
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
  text({ style: [styles.raceTimeText, getRaceStartTime(props.item) && styles.raceTimeTextSet] }),
  when(isNil, always('Set time')),
  unless(isNil, dateTimeShortHourText),
  getRaceStartTime)(
  props.item))

const raceDateAndTime = Component((props: any) => compose(
  fold(props),
  text({}),
  when(isNil, always('--')),
  unless(isNil, time => `${dateShortText(time)} | ${dateTimeShortHourText(time)}`),
  getRaceStartTime)(
  props.item))

const raceItem = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.raceItemContainer }),
    concat(nothingIfCannotUpdateCurrentEvent(raceTimePicker)),
    concat(__, [
      nothingIfCannotUpdateCurrentEvent(defineLayoutButton),
      raceAnalyticsButton,
      arrowRight]),
    view({ style: styles.raceDateAndTimeContainer }),
    reduce(concat, nothing()))([
    nothingIfCanUpdateCurrentEvent(raceDateAndTime),
    text({ style: styles.raceNameText }, defaultTo('', props.item.name)) ]))

const raceList = Component((props: object) => compose(
  fold(props),
  view({ style: styles.racesListContainer }))(
  forwardingPropsFlatList.contramap((props: any) =>
    merge({
      data: props.races,
      renderItem: raceItem.fold
    }, props))))

const organizerContainer = Component((props: Object) =>
  compose(
    fold(props),
    view({ style: styles.organizerContainer }),
    reduce(concat, nothing()))
  ([
    text({ style: styles.sectionHeaderStyle }, 'LIST OF RACES'),
    raceNumberSelector,
    text({}, 'Discards starting from ... races')]))

const competitorContainer = Component((props: any) =>
  compose(
    fold(props),
    view({ style: styles.competitorContainer }),
    view({ style: styles.eventStatsContainer }),
    reduce(concat, nothing()))([
      text({}, `${dateShortText(props.session.event.startDate)} | ${dateTimeShortHourText(props.session.event.startDate)} | NUMBER OF TRACKS ${props.numberOfRaces}`),
      text({ style: styles.eventTitle }, props.session.regattaName)
    ]))

export default Component((props: Object) =>
  compose(
    fold(props),
    connect(mapStateToProps, {
      selectCourse, selectRace, setRaceTime,
      updateEventSettings, openTrackDetails }),
    view({ style: styles.mainContainer }),
    reduce(concat, nothing()))
  ([nothingIfCannotUpdateCurrentEvent(organizerContainer),
    nothingIfCanUpdateCurrentEvent(competitorContainer),
    raceList ]))
