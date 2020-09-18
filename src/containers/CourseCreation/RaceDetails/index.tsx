import { __, always, append, compose, concat, cond, defaultTo,
  equals, isEmpty, isNil, map, merge, not, apply, unapply,
  objOf, prop, reduce, uncurryN, T, unless, when, dissocPath, path, addIndex,
  gte, allPass, propEq
} from 'ramda'
import Images from '@assets/Images'
import { selectCourse } from 'actions/courses'
import { selectRace, setRaceTime, startTracking, setDiscards, updateEventSettings, startPollingSelectedEvent, stopPollingSelectedEvent } from 'actions/events'
import { registerAppStateListeners, unregisterAppStateListeners } from 'actions/appState'
import { openTrackDetails } from 'actions/navigation'
import {
  Component,
  fold,
  fromClass,
  nothing,
  nothingAsClass,
  recomposeBranch as branch,
  recomposeMapProps as mapProps,
  recomposeLifecycle as lifeCycle,
  recomposeWithState as withState,
  reduxConnect as connect,
} from 'components/fp/component'
import { forwardingPropsFlatList, text, touchableOpacity, view } from 'components/fp/react-native'
import { nothingIfCannotUpdateCurrentEvent, nothingIfCanUpdateCurrentEvent } from 'components/helpers'
import IconText from 'components/IconText'
import { canUpdateCurrentEvent } from 'selectors/permissions'
import { dateShortText, dateTimeShortHourText } from 'helpers/date'
import { showNetworkRequiredSnackbarMessage } from 'helpers/network'
import I18n from 'i18n'
import moment from 'moment/min/moment-with-locales'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { getCourseById, getCourseSequenceDisplay } from 'selectors/course'
import { getRaceTime, getSelectedEventInfo } from 'selectors/event'
import { isNetworkConnected } from 'selectors/network'
import { getRegattaPlannedRaces, getSelectedRegatta } from 'selectors/regatta'
import { isCurrentLeaderboardTracking } from 'selectors/leaderboard'
import { getSession } from 'selectors/session'
import { DiscardSelector, FramedNumber, overlayPicker, withAddDiscard, withUpdatingDiscardItem } from '../../session/common'
import styles, { arrowColor, clockIconColor } from './styles'

const icon = compose(
  fromClass(IconText).contramap,
  always
)

const getRegattaPlannedRacesN = uncurryN(2, getRegattaPlannedRaces)

const getRaceStartTime = compose(
  prop('startTimeAsMillis'),
  defaultTo({}),
  prop('raceTime'))

const nothingIfNoCourseDefined = branch(compose(propEq('courseDefined', false), prop('item')), nothingAsClass)

const nothingIfNoSession = branch(compose(isNil, prop('session')), nothingAsClass)

const nothingIfMoreThan10MinutesBeforeStartAndCantUpdateEvent = branch(
  allPass([
    compose(
      gte(-10*60*1000), // 10 minutes before
      (startTime: number) => Date.now() - startTime,
      defaultTo(Infinity),
      getRaceStartTime,
      prop('item')
    ),
    compose(
      not,
      prop('canUpdateCurrentEvent')
    )
  ]),
  nothingAsClass
)

const nothingIfRaceTimeNotSet = branch(
  compose(
    isNil,
    getRaceStartTime,
    prop('item')
  ),
  nothingAsClass
)

const withDateTimePickerName = withState('dateTimePickerName', 'setDateTimePickerName', null)

const withPollingOfEvent = compose(
  lifeCycle({
    componentDidMount() {
      // add only for competitor screen
      if (!this.props.canUpdateCurrentEvent) {
        this.props.navigation.addListener('focus',
          () => {
            this.props.registerAppStateListeners()
            this.props.startPollingSelectedEvent()
          })
        this.props.navigation.addListener('blur',
          () => {
            this.props.unregisterAppStateListeners()
            this.props.stopPollingSelectedEvent()
          })
      }
    }
  }))

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

  return {
    session,
    isTracking: isCurrentLeaderboardTracking(state),
    canUpdateCurrentEvent: canUpdateCurrentEvent(state),
    numberOfRaces: races.length,
    discards: path(['leaderboard', 'discardIndexResultsStartingWithHowManyRaces'])(session),
    isNetworkConnected: isNetworkConnected(state),
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
  props.selectCourse({ race: name, navigation: props.navigation })
}


const arrowRight = icon({
  source: Images.actions.arrowRight,
  iconStyle: styles.iconStyle,
  style: styles.arrowRightContainerStyle,
  iconTintColor: arrowColor
})

const editIcon = Component((props: any) => compose(
  fold(props),
  view({style: styles.editIconContainerStyle})
  )(icon({ 
    source: Images.actions.penEdit, 
    iconStyle: styles.iconEditStyle,
    iconTintColor: arrowColor
  }))
)

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
        props.item.courseDefined ? props.item.sequenceDisplay :
        !props.canUpdateCurrentEvent ? I18n.t('caption_course_not_defined'):
        I18n.t('caption_define_course')),
      nothingIfNoCourseDefined(editIcon)
    ]))

const raceAnalyticsButton = Component((props: any) =>
  compose(
    fold(props),
    view({ style: styles.sapAnalyticsContainer }),
    touchableOpacity({
      onPress: cond([
        [always(!props.isNetworkConnected), showNetworkRequiredSnackbarMessage],
        [always(props.isTracking), () => props.openTrackDetails(props.item, props.navigation)],
        [T, async () => {
          await props.startTracking(props.session)
          props.openTrackDetails(props.item, props.navigation)
        }]
      ])
    }))(
    text({ style: styles.sapAnalyticsButton }, 'Go to SAP Analytics'.toUpperCase())))

const clockIcon = Component((props: any) => compose(
  fold(props),
  view({ style: styles.clockIconContainerStyle })
  )(icon({
    source: Images.info.clock,
    iconStyle: styles.clockIconStyle,
    iconTintColor: clockIconColor
  }))
)

const raceTimePickerComponent = fromClass(DateTimePicker).contramap((props: any) => ({
  onConfirm: (value: number) => {
    props.setDateTimePickerName(null)
    if (!props.isTracking) {
      props.startTracking(props.session)
    }
    return props.setRaceTime({
      race: props.item.name,
      raceTime: props.item.raceTime,
      value
    })
  },
  onCancel: () => {
    props.setDateTimePickerName(null)
  },
  date: new Date(moment(getRaceStartTime(props.item) || new Date())),
  diplay: 'spinner',
  mode: 'datetime',
  confirmTextIOS: I18n.t('caption_confirm'),
  cancelTextIOS: I18n.t('caption_cancel'),
  isVisible: props.dateTimePickerName === props.item.name,
}))

const raceTimePickerTouchableHighlight = (props: any) => touchableOpacity({
  onPress: () => {
    if (!props.isNetworkConnected) {
      showNetworkRequiredSnackbarMessage()
      return
    }
    props.setDateTimePickerName(props.item.name)
  },
  disabled: !props.canUpdateCurrentEvent,
})

const raceTimePicker = Component((props: any) => compose(
  fold(props),
  concat(raceTimePickerComponent),
  view({ style: styles.raceTimeContainer }),
  raceTimePickerTouchableHighlight(props),
  view({ style: styles.raceNameTimeContainer }),
  concat(arrowRight),
  concat(clockIcon),
  text({ style: [styles.raceTimeText] }),
  when(isNil, props.canUpdateCurrentEvent ? always(I18n.t('caption_set_time')) : always(I18n.t('caption_time_not_set'))),
  unless(isNil, dateTimeShortHourText),
  getRaceStartTime)(
  props.item))

const raceItem = Component((props: object) =>
  compose(
    fold(props),
    view({ style:
      [styles.raceItemContainer,
        ...(props.index == props.numberOfRaces - 1 ? [styles.raceLastItemContainer] : [])
      ]
    }),
    concat(__,
      compose(
        nothingIfRaceTimeNotSet,
        nothingIfMoreThan10MinutesBeforeStartAndCantUpdateEvent
      )(raceAnalyticsButton)
    ),
    view({ style: styles.raceDetailsContainer }),
    concat(text({ style: styles.raceNameText }, defaultTo('', props.item.name))),
    view({ style: styles.raceItemButtonContainer }),
    reduce(concat, nothing()))([
      raceTimePicker,
      nothingIfCannotUpdateCurrentEvent(defineLayoutButton)
     ]))

const raceList = Component((props: object) => compose(
  fold(props),
  view({ style: styles.racesListContainer }))(
  forwardingPropsFlatList.contramap((props: any) =>
    merge({
      data: props.races,
      renderItem: raceItem.fold
    }, props))))

const mapIndexed = addIndex(map)

const withDiscardDataFromEvent = mapProps(props => compose(
  merge(props),
  objOf('data'),
  append({ type: 'add' }),
  mapIndexed((value, index) => ({ value, index })),
  prop('discards')
)(props))

const discardSelector = Component((props:any) => compose(
  fold(props),
  withDiscardDataFromEvent,
  withUpdatingDiscardItem((discards) => props.setDiscards({discards, session: props.session })),
  withAddDiscard((discards) => props.setDiscards({discards, session: props.session })))
  (DiscardSelector)
)

const organizerContainer = Component((props: Object) =>
  compose(
    fold(props),
    view({ style: styles.organizerContainer }),
    reduce(concat, nothing()))
  ([
    raceNumberSelector,
    discardSelector]))

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
      selectCourse, selectRace, setRaceTime, startTracking,
      updateEventSettings, openTrackDetails, setDiscards,
      startPollingSelectedEvent, stopPollingSelectedEvent,
      registerAppStateListeners, unregisterAppStateListeners }, null,
      { areStatePropsEqual: compose(
        apply(equals),
        unapply(map(dissocPath(['session', 'leaderboard'])))) }),
    withDateTimePickerName,
    withPollingOfEvent,
    nothingIfNoSession,
    view({ style: styles.mainContainer }),
    reduce(concat, nothing()))
  ([nothingIfCannotUpdateCurrentEvent(organizerContainer),
    nothingIfCanUpdateCurrentEvent(competitorContainer),
    raceList ]))
