import { __, always, append, compose, concat, defaultTo,
  equals, isEmpty, isNil, map, merge, not,
  objOf, prop, reduce, uncurryN, unless, when } from 'ramda'
import { Dimensions } from 'react-native'
import { selectCourse } from 'actions/courses'
import { selectRace, setRaceTime, updateEventSettings } from 'actions/events'
import { openTrackDetails } from 'actions/navigation'
import {
  Component,
  fold,
  fromClass,
  nothing,
  nothingAsClass,
  recomposeBranch as branch,
  recomposeMapProps as mapProps,
  reduxConnect as connect,
} from 'components/fp/component'
import { forwardingPropsFlatList, text, touchableOpacity, view } from 'components/fp/react-native'
import { nothingIfCannotUpdateCurrentEvent, nothingIfCanUpdateCurrentEvent } from 'components/helpers'
import Images from '@assets/Images'
import IconText from 'components/IconText'
import { canUpdateCurrentEvent } from 'selectors/permissions'
import { dateShortText, dateTimeShortHourText } from 'helpers/date'
import I18n from 'i18n'
import moment from 'moment/min/moment-with-locales'
import DatePicker from 'react-native-datepicker'
import { getCourseById, getCourseSequenceDisplay } from 'selectors/course'
import { getRaceTime, getSelectedEventInfo } from 'selectors/event'
import { getRegattaPlannedRaces, getSelectedRegatta } from 'selectors/regatta'
import { getSession } from 'selectors/session'
import { DiscardSelector, FramedNumber, overlayPicker, withAddDiscard, withUpdatingDiscardItem } from '../../session/common'
import styles from './styles'

const icon = compose(
  fromClass(IconText).contramap,
  always
)

const getRegattaPlannedRacesN = uncurryN(2, getRegattaPlannedRaces)

const getRaceStartTime = compose(
  prop('startTimeAsMillis'),
  defaultTo({}),
  prop('raceTime'))

const nothingIfNoSession = branch(compose(isNil, prop('session')), nothingAsClass)
const nothingIfNoRaceTime = branch(compose(
  isNil,
  getRaceStartTime,
  prop('item')),
  nothingAsClass)

const mapStateToProps = (state: any, props: any) => {
  const eventData = getSelectedEventInfo(state)

  if (isNil(eventData)) {
    return {}
  }

  const { leaderboardName, regattaName } = eventData
  const session = getSession(leaderboardName)(state)

  const getCourseId = (raceName: string) => `${session.regattaName} - ${raceName}`
  const isCourseDefined = (raceName: string) => (state: any) =>
    compose(
      not,
      isEmpty,
      defaultTo({}),
      prop('waypoints'),
      getCourseById(getCourseId(raceName))
    )(state)

  const races = compose(
    map((name: string) => ({
      name,
      regattaName,
      sequenceDisplay: getCourseSequenceDisplay(getCourseId(name))(state),
      courseDefined: isCourseDefined(name)(state),
      raceTime: getRaceTime(leaderboardName, name)(state)
    })),
    getRegattaPlannedRacesN(__, state),
    getSelectedRegatta)(
    state)

  console.log({races})

  return {
    session,
    canUpdateCurrentEvent: canUpdateCurrentEvent(state),
    numberOfRaces: races.length,
    races,
  }
}

const raceNumberSelector = Component((props: any) =>
  compose(
    fold(props),
    concat(text({ style: styles.textHeader }, I18n.t('text_planned_number_of_races'))),
    view({ style: styles.raceNumberContainer }),
    overlayPicker({
      selectedValue: props.numberOfRaces,
      onValueChange: v => props.updateEventSettings(props.session, { numberOfRaces: v }),
    }))(
    FramedNumber.contramap(always({ value: props.numberOfRaces }))))

const onSeeCourse = (props: any) => {
  const { name } = props.item
  props.selectCourse({ race: name })
}


const arrowRight = icon({
  source: Images.actions.arrowRight,
  iconStyle: styles.iconStyle,
  style: styles.arrowRightContainerStyle,
  iconTintColor: 'black'
})

const defineLayoutButton = Component((props: any) =>
  compose(
    fold(props),
    view({ style: styles.defineLayoutButtonContainer }),
    touchableOpacity({
      disabled: !props.canUpdateCurrentEvent,
      onPress: () => onSeeCourse(props)
    }),
    view({ style: { flexDirection: 'row' }}),
    concat(arrowRight),
    reduce(concat, nothing()))([
      text({ style: styles.defineCourseText },
        !props.canUpdateCurrentEvent ? '--' :
        props.item.courseDefined ? props.item.sequenceDisplay :
        I18n.t('caption_define_course'))
    ]))

const raceAnalyticsButton = Component((props: any) =>
  compose(
    fold(props),
    view({ style: styles.sapAnalyticsContainer }),
    touchableOpacity({
      onPress: () => props.openTrackDetails(props.item)
    }))(
    text({ style: styles.sapAnalyticsButton }, 'Go to SAP Analytics'.toUpperCase())))

const clockIcon = icon({
  source: Images.tabs.account,
  iconStyle: styles.clockIconStyle,
  style: styles.clockIconContainerStyle,
  iconTintColor: 'black'
})

const raceTimePicker = Component((props: any) => compose(
  fold(props),
  view({ style: styles.raceTimeContainer }),
  concat(__, fromClass(DatePicker).contramap(always({
    onDateChange: (value: number) => props.setRaceTime({
      race: props.item.name,
      raceTime: props.item.raceTime,
      value
    }),
    date: moment(getRaceStartTime(props.item) || new Date()),
    androidMode: 'spinner',
    mode: 'datetime',
    confirmBtnText: I18n.t('caption_confirm'),
    cancelBtnText: I18n.t('caption_cancel'),
    hideText: true,
    disabled: !props.canUpdateCurrentEvent,
    showIcon: false,
    style: {position: 'absolute', width: Dimensions.get('window').width / 2 - 30, height: 60, top: 0, left: 0 },
    customStyles: {
      dateInput: {
        height: 60,
        width: Dimensions.get('window').width / 2 - 30,
        borderWidth: 0,
      }
    },
  }))),
  view({ style: styles.raceNameTimeContainer }),
  concat(arrowRight),
  concat(clockIcon),
  text({ style: [styles.raceTimeText, styles.raceTimeTextSet] }),
  when(isNil, props.canUpdateCurrentEvent ? always(I18n.t('caption_set_time')) : always('--')),
  unless(isNil, dateTimeShortHourText),
  getRaceStartTime)(
  props.item))

const raceItem = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.raceItemContainer }),
    concat(__, nothingIfNoRaceTime(raceAnalyticsButton)),
    view({ style: styles.raceDetailsContainer }),
    concat(text({ style: styles.raceNameText }, defaultTo('', props.item.name))),
    view({ style: styles.raceItemButtonContainer }),
    reduce(concat, nothing()))([
      raceTimePicker,
      defineLayoutButton
     ]))

const raceList = Component((props: object) => compose(
  fold(props),
  view({ style: styles.racesListContainer }))(
  forwardingPropsFlatList.contramap((props: any) =>
    merge({
      data: props.races,
      renderItem: raceItem.fold
    }, props))))

const withDiscardDataFromEvent = mapProps(props => compose(
  merge(props),
  objOf('data'),
  append({ type: 'add' }))([]))

const discardSelector = compose(
  withDiscardDataFromEvent,
  withUpdatingDiscardItem(() => {}),
  withAddDiscard(() => {}))(
  DiscardSelector)

const organizerContainer = Component((props: Object) =>
  compose(
    fold(props),
    view({ style: styles.organizerContainer }),
    reduce(concat, nothing()))
  ([
    raceNumberSelector,
    /*discardSelector*/]))

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
      updateEventSettings, openTrackDetails }, null, { areStatePropsEqual: equals }),
    nothingIfNoSession,
    view({ style: styles.mainContainer }),
    reduce(concat, nothing()))
  ([nothingIfCannotUpdateCurrentEvent(organizerContainer),
    nothingIfCanUpdateCurrentEvent(competitorContainer),
    raceList ]))
