import { __, compose, concat, curry, defaultTo, merge, reduce, toUpper, propEq,
  prop, isNil, equals, both, unless, last } from 'ramda'
import Images from '@assets/Images'
import { checkOut, collectCheckInData } from 'actions/checkIn'
import { shareSessionRegatta } from 'actions/sessions'
import { fetchLeaderboardV2 } from 'actions/leaderboards'
import { stopTracking } from 'actions/events'
import { startTracking } from 'actions/tracking'
import * as Screens from 'navigation/Screens'
import { isCurrentLeaderboardTracking, isCurrentLeaderboardFinished } from 'selectors/leaderboard'
import { showNetworkRequiredSnackbarMessage } from 'helpers/network'
import { Component, fold, nothing,
  reduxConnect as connect,
  recomposeBranch as branch,
  nothingAsClass,
  fromClass,
  contramap
} from 'components/fp/component'
import { iconText, scrollView, text, inlineText, touchableOpacity, view, textButton } from 'components/fp/react-native'
import I18n from 'i18n'
import { Alert } from 'react-native'
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
  startTrackingButton
} from '../../session/common'
import { getRegattaPlannedRaces } from 'selectors/regatta'
import {getRaceTime} from 'selectors/event';

const nothingWhenTracking = branch(propEq('isTracking', true), nothingAsClass)
const nothingWhenFinished = branch(propEq('isFinished', true), nothingAsClass)
const nothingWhenBeforeLastPlannedRaceStartTime = branch(propEq('isBeforeLastPlannedRaceStartTime', true), nothingAsClass)
const nothingWhenNoBoatClass = branch(compose(equals(''), prop('boatClass')), nothingAsClass)
const nothingIfCurrentUserIsCompetitor = branch(propEq('currentUserIsCompetitorForEvent', true), nothingAsClass)

const styledButton = curry(({ onPress, style }, content: any) => Component((props: any) => compose(
  fold(props),
  touchableOpacity({ onPress }))(
  view({ style: [ styles.button, style ] }, content))))

const nothingIfNoSession = branch(compose(isNil, prop('session')), nothingAsClass)

const mapStateToProps = (state: any, props: any) => {
  const sessionData = mapStateToSessionDetailsProps(state, props)

  const lastPlannedRaceTime = compose(
    unless(isNil, prop('startTimeAsMillis')),
    unless(isNil, (raceName) => getRaceTime(sessionData.session.leaderboardName, raceName)(state)),
    last,
    defaultTo([]),
    getRegattaPlannedRaces(sessionData?.session?.regattaName),
  )(state)

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
  }
}

const sessionData = {
  racesAndScoringOnPress: (props: any) => props.navigation.navigate(Screens.RaceDetails, { data: props.session }),
  inviteCompetitors: (props: any) => props.shareSessionRegatta(props.session.leaderboardName),
}

const endEvent = (props: any) => {
  Alert.alert(I18n.t('caption_end_event'), I18n.t('text_tracking_alert_stop_confirmation_message'), [
    { text: I18n.t('button_yes'), onPress: () => props.stopTracking(props.session) },
    { text: I18n.t('button_no') },
  ])
}

export const sessionDetailsCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder1 }, nothing())),
    view({ style: styles.container1 }),
    reduce(concat, nothing()))([
    text({ style: styles.textLight }, props.startDate),
    text({ style: styles.headlineHeavy }, props.name),
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
    startTrackingButton,
    nothingWhenFinished(qrCode),
    competitorList
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
    connect(mapStateToProps, {
      checkOut, startTracking, stopTracking, collectCheckInData, shareSessionRegatta, fetchLeaderboardV2
    }),
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
