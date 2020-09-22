import { __, always, compose, concat, curry, merge, mergeLeft, reduce, toUpper, propEq,
  prop, isNil, equals } from 'ramda'
import Images from '@assets/Images'
import { dataApi } from 'api'
import { checkOut, collectCheckInData } from 'actions/checkIn'
import { shareSessionRegatta } from 'actions/sessions'
import { fetchRegattaCompetitors } from 'actions/regattas'
import { fetchEvent, updateEventBasics, stopTracking } from 'actions/events'
import { startTracking } from 'actions/tracking'
import * as Screens from 'navigation/Screens'
import { isCurrentLeaderboardTracking, isCurrentLeaderboardFinished } from 'selectors/leaderboard'
import { editResultsUrl } from 'services/CheckInService'
import { Component, contramap, fold, fromClass, nothing,
  reduxConnect as connect,
  recomposeBranch as branch,
  recomposeWithState as withState,
  nothingAsClass
} from 'components/fp/component'
import { icon, iconText, scrollView, text, inlineText, touchableOpacity, view, textButton } from 'components/fp/react-native'
import TextInput from 'components/TextInput'
import I18n from 'i18n'
import { ActivityIndicator, Alert } from 'react-native'
import { container } from 'styles/commons'
import styles from './styles'
import { mapStateToSessionDetailsProps } from '../SessionDetail'
import {
  qrCode,
  inviteCompetitorsButton,
  joinAsCompetitorButton,
  competitorList,
  withCompetitorListState,
  competitorListRefreshHandler,
  startTrackingButton,
  shareEventButton,
} from '../../session/common'
import { getLastPlannedRaceTime } from 'selectors/regatta'
import { isNetworkConnected as isNetworkConnectedSelector } from 'selectors/network'
import { showNetworkRequiredSnackbarMessage } from 'helpers/network'
import { showUnknownErrorSnackbarMessage } from 'helpers/errors'
import Clipboard from '@react-native-community/clipboard'
import Snackbar from 'react-native-snackbar'
import DateTimePicker from 'react-native-modal-datetime-picker'

const nothingWhenFinished = branch(propEq('isFinished', true), nothingAsClass)
// If we change this we need to make sure that the stopTracking function in the EventsSaga sets the tracking end time on the correct race
const nothingWhenBeforeLastPlannedRaceStartTime = branch(propEq('isBeforeLastPlannedRaceStartTime', true), nothingAsClass)
const nothingWhenNoBoatClass = branch(compose(equals(''), prop('boatClass')), nothingAsClass)
const nothingIfCurrentUserIsCompetitor = branch(propEq('currentUserIsCompetitorForEvent', true), nothingAsClass)
const nothingIfCurrentUserIsNotACompetitor = branch(propEq('currentUserIsCompetitorForEvent', false), nothingAsClass)

const styledButton = curry(({ onPress, style }, content: any) => Component((props: any) => compose(
  fold(props),
  touchableOpacity({ onPress }))(
  view({ style: [ styles.button, style ] }, content))))

const nothingIfNoSession = branch(compose(isNil, prop('session')), nothingAsClass)

const mapStateToProps = (state: any, props: any) => {
  const sessionData = mapStateToSessionDetailsProps(state, props)

  const lastPlannedRaceTime = getLastPlannedRaceTime(sessionData?.session?.leaderboardName, sessionData?.session?.regattaName)(state)

  const isBeforeLastPlannedRaceStartTime = lastPlannedRaceTime
    ? Date.now() < lastPlannedRaceTime
    : true

  const isBeforeEventStartTime =
    (sessionData.session?.event?.startDate || new Date(0)) > Date.now()

  return {
    ...sessionData,
    isBeforeLastPlannedRaceStartTime,
    isTracking: isCurrentLeaderboardTracking(state),
    isFinished: isCurrentLeaderboardFinished(state),
    isEventOrganizer: true,
    isNetworkConnected: isNetworkConnectedSelector(state)
  }
}

const withIsEditingEventName = withState('isEditingEventName', 'setIsEditingEventName', false)
const withIsSavingEventName = withState('isSavingEventName', 'setIsSavingEventName', false)
const withEventNameField = withState('eventNameField', 'setEventNameField', '')
const withDatePickerName = withState('datePickerName', 'setDatePickerName', null)
const nothingIfEditingEventName = branch(propEq('isEditingEventName', true), nothingAsClass)
const nothingIfNotEditingEventName = branch(propEq('isEditingEventName', false), nothingAsClass)
const nothingIfSavingEventName = branch(propEq('isSavingEventName', true), nothingAsClass)
const nothingIfNotSavingEventName = branch(propEq('isSavingEventName', false), nothingAsClass)
const nothingWhenNoEndDate = branch(propEq('endDate', null), nothingAsClass)

const sessionData = {
  racesAndScoringOnPress: (props: any) => props.navigation.navigate(Screens.RaceDetails, { data: props.session }),
  inviteCompetitors: (props: any) => props.shareSessionRegatta(props.session.leaderboardName),
}

const endEvent = (props: any) => {
  Alert.alert(I18n.t('caption_end_event'), I18n.t('text_end_event_alert_message'), [
    { text: I18n.t('button_yes'), onPress: () => props.stopTracking(props.session) },
    { text: I18n.t('button_no') },
  ])
}

const editIcon = Component((props: any) => compose(
  fold(props),
  touchableOpacity({ onPress: () => {
    props.setIsEditingEventName(true)
    props.setEventNameField(props.name)
  }})
)(icon({ source: Images.actions.pen, iconTintColor: 'white', style: styles.eventNameIcon })))

const confirmIcon = Component((props: any) => compose(
  fold(props),
  touchableOpacity({ onPress: async () => {
    if (!props.isNetworkConnected) {
      showNetworkRequiredSnackbarMessage()
      return
    }

    props.setIsSavingEventName(true)
    try {
      await updateEventBasics({ name: props.eventNameField }, props.session)
      const api = dataApi(props.session.serverUrl)
      await props.fetchEvent(api.requestEvent, props.session.eventId, props.session.secret)
      props.setIsEditingEventName(false)
    } catch (err) {
      showUnknownErrorSnackbarMessage()
    } finally {
      props.setIsSavingEventName(false)
    }
  }})
)(icon({ source: Images.actions.accept, iconTintColor: 'white', style: styles.eventNameIcon })))

const eventNameTextInput = Component((props: any) => compose(
  fold(props),
  view({ style: styles.eventNameField }),
  contramap(always({
    value: props.eventNameField,
    onChangeText: props.setEventNameField,
  })),
)(fromClass(TextInput)))

const loader = fromClass(ActivityIndicator).contramap(always({
  size: 'small',
  color: 'white'
}))

const eventName = Component((props: any) => compose(
  fold(props),
  view({ style: styles.eventNameContainer }),
  reduce(concat, nothing())
)([
  nothingIfEditingEventName(text({ style: styles.headlineHeavy }, props.name)),
  nothingIfEditingEventName(editIcon),
  nothingIfNotEditingEventName(eventNameTextInput),
  nothingIfNotEditingEventName(nothingIfSavingEventName(confirmIcon)),
  nothingIfNotEditingEventName(nothingIfNotSavingEventName(loader)),
]))

const openDateEditingModal = (props: any, datePickerPurpose: string) => () => {
  if (props.endDate === null) { // If you click on the date when there is only a single date shown, then edit the end date
    props.setDatePickerName('END_DATE')
  }
  else {
    props.setDatePickerName(datePickerPurpose)
  }
}

const dateText = Component((props: any) => compose(
  fold(props),
  view({ style: { flexDirection: 'row' } }),
  reduce(concat, nothing()))([
    touchableOpacity(
      { onPress: openDateEditingModal(props, 'START_DATE') },
      text({ style: styles.textLight }, props.startDate)
    ),
    nothingWhenNoEndDate(text({ style: styles.textLight }, ' - ')),
    nothingWhenNoEndDate(touchableOpacity(
      { onPress: openDateEditingModal(props, 'END_DATE') },
      text({ style: styles.textLight }, props.endDate))
    ),
  ]))

const dateEditor = fromClass(DateTimePicker).contramap((props: any) => ({
  onConfirm: async (value: number) => {
    if (!props.isNetworkConnected) {
      showNetworkRequiredSnackbarMessage()
      return
    }

    try {
      const updatePayload = props.datePickerName === 'START_DATE' ? { dateFrom: value } : { dateTo: value }
      await updateEventBasics(updatePayload, props.session)
      const api = dataApi(props.session.serverUrl)
      props.setDatePickerName(null)
      await props.fetchEvent(api.requestEvent, props.session.eventId, props.session.secret)
    } catch (err) {
      showUnknownErrorSnackbarMessage()
    }
  },
  onCancel: () => {
    props.setDatePickerName(null)
  },
  date: props.datePickerName === 'START_DATE' ? props.session.event.startDate
    : props.datePickerName === 'END_DATE' ? props.session.event.endDate
    : new Date(),
  maximumDate: props.datePickerName === 'START_DATE' ? props.session.event.endDate : undefined,
  minimumDate: props.datePickerName === 'END_DATE' ? props.session.event.startDate : undefined,
  mode: 'date',
  confirmTextIOS: I18n.t('caption_confirm'),
  cancelTextIOS: I18n.t('caption_cancel'),
  isVisible: props.datePickerName !== null,
}))

export const sessionDetailsCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder1 }, nothing())),
    view({ style: styles.container1 }),
    reduce(concat, nothing()))([
    dateText,
    eventName,
    iconText({
      style: styles.location,
      iconStyle: styles.locationIcon,
      textStyle: [props.boatClass !== '' ? styles.textValue : styles.textLast, styles.textValue],
      source: Images.info.location,
      alignment: 'horizontal'}, props.location),
    inlineText({ style: props.boatClass !== '' ? styles.text : styles.textLast }, [
      text({ style: styles.textLight }, 'Style '),
      text({ style: styles.textValue }, I18n.t(props.boatClass !== '' ? 'caption_one_design' : 'text_handicap_label').toUpperCase())
    ]),
    nothingWhenNoBoatClass(inlineText( { style: styles.textLast }, [
      text({ style: styles.textLight }, `${I18n.t('text_class')} `),
      text({ style: styles.textValue }, props.boatClass),
    ]))
  ]))

export const defineRacesCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder2 }, nothing())),
    view({ style: styles.container2 }),
    reduce(concat, nothing()))([
    text({ style: styles.headline }, I18n.t('caption_define').toUpperCase()),
    text({ style: [styles.textExplain, styles.textLast] },
      props.isTracking || props.isFinished ?
      I18n.t('text_define_races_long_text_running') :
      I18n.t('text_define_races_long_text_planning')),
    styledButton({
      onPress: (props: any) => props.racesAndScoringOnPress && props.racesAndScoringOnPress(props),
    },text({ style: styles.buttonContent }, toUpper(props.racesButtonLabel)))
  ]))

const editResultsButton = Component((props: any) => compose(
  fold(props),
  textButton({
    onPress: async (props: any) => {
      props.navigation.navigate(Screens.EditResults, { data: { url: editResultsUrl(props.session) } })
    },
    style: [styles.button],
    textStyle: styles.buttonContent,
  }))(text({}, I18n.t('caption_edit_results').toUpperCase())))

const copyEditLinkToClipboardButton = Component((props: any) => compose(
  fold(props),
  textButton({
  onPress: async (props: any) => {
    Clipboard.setString(editResultsUrl(props.session))
    Snackbar.show({
      text: I18n.t('text_link_copied_to_clipboard'),
      duration: Snackbar.LENGTH_SHORT
    })
  },
  style: [styles.button],
  textStyle: styles.buttonContent }))(
  text({}, I18n.t('caption_copy_edit_results_to_clipboard').toUpperCase())))

export const inviteCompetitorsCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder3 }, nothing())),
    view({ style: styles.container3 }),
    reduce(concat, nothing()))([
    text({ style: styles.headline }, I18n.t('caption_invite').toUpperCase()),
    text({ style: [styles.textExplain, styles.textLast] },
      props.isFinished ?
      I18n.t('text_invite_competitors_long_text_running') :
      I18n.t('text_invite_competitors_long_text_planning')),
    nothingWhenFinished(inviteCompetitorsButton),
    nothingWhenFinished(nothingIfCurrentUserIsCompetitor(joinAsCompetitorButton)),
    shareEventButton,
    nothingIfCurrentUserIsNotACompetitor(startTrackingButton),
    nothingWhenFinished(qrCode),
    competitorList,
    editResultsButton,
    copyEditLinkToClipboardButton
  ]))

export const endEventCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder4 }, nothing())),
    view({ style: styles.container4 }),
    reduce(concat, nothing()))([
    text({ style: styles.headline }, I18n.t('caption_end').toUpperCase()),
    text({ style: [styles.textExplain, styles.textLast] }, !props.trackingStopped ? I18n.t('text_end_event_long_text_running') : I18n.t('text_end_event_long_text_finished')),
    nothingWhenFinished(
    textButton({
      onPress: (props: any) => endEvent(props),
      style: styles.buttonBig,
      textStyle: styles.buttonBigContent,
    },text({}, I18n.t('caption_end_event').toUpperCase())))
  ]))


export default Component((props: any) => compose(
    fold(merge(props, sessionData)),
    withIsEditingEventName,
    withIsSavingEventName,
    withEventNameField,
    withDatePickerName,
    connect(
      mapStateToProps,
      { fetchEvent, checkOut, startTracking, stopTracking, collectCheckInData, shareSessionRegatta, fetchRegattaCompetitors },
      null,
      {
        pure: true,
        areStatePropsEqual: equals
      }),
    concat(dateEditor),
    scrollView({ style: styles.container, nestedScrollEnabled: true }),
    nothingIfNoSession,
    withCompetitorListState,
    view({ style: [container.list, styles.cardsContainer] }),
    reduce(concat, nothing()))([
    competitorListRefreshHandler,
    sessionDetailsCard,
    defineRacesCard,
    inviteCompetitorsCard,
    nothingWhenFinished(nothingWhenBeforeLastPlannedRaceStartTime(endEventCard)),
  ]))
