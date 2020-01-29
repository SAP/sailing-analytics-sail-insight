import { __, compose, concat, curry, merge, reduce, toUpper, propEq,
  prop, isNil } from 'ramda'
import Images from '@assets/Images'
import { checkOut, collectCheckInData } from 'actions/checkIn'
import { shareSessionRegatta } from 'actions/sessions'
import { Component, fold, nothing,
  reduxConnect as connect,
  recomposeBranch as branch,
  nothingAsClass
} from 'components/fp/component'
import { iconText, scrollView, text, inlineText, touchableOpacity, view } from 'components/fp/react-native'
import I18n from 'i18n'
import { navigateToRaceDetails } from 'navigation'
import { Alert } from 'react-native'
import { container } from 'styles/commons'
import styles from './styles'
import { mapStateToSessionDetailsProps } from '../SessionDetail'
import { qrCode, inviteCompetitorsButton, joinAsCompetitorButton } from '../../session/common'

const nothingWhenEntryIsClosed = branch(propEq('entryClosed', true), nothingAsClass)
const nothingWhenTrackingIsStopped = branch(propEq('trackingStopped', true), nothingAsClass)
const nothingWhenNoBoatClass = branch(compose(isNil, prop('boatClass')), nothingAsClass)

const styledButton = curry(({ onPress, style }, content: any) => Component((props: any) => compose(
  fold(props),
  touchableOpacity({ onPress }))(
  view({ style: [ styles.button, style ] }, content))))

const mapStateToProps = (state: any, props: any) => {
  const sessionData = mapStateToSessionDetailsProps(state, props)

  return {
    ...sessionData,
    entryClosed: false,
    trackingStopped: false
  }
}

const sessionData = {
  racesAndScoringOnPress: (props: any) => navigateToRaceDetails(props.session),
  inviteCompetitors: (props: any) => props.shareSessionRegatta(props.session.leaderboardName),
}

const closeEntry = (props: any) => {
  Alert.alert(I18n.t('caption_start_tracking'), I18n.t('text_alert_for_start_tracking'), [
    { text: I18n.t('button_yes'), onPress: () => 'todo: closeEntryAction' }, // todo: set event state to entry closed
    { text: I18n.t('button_no') },
  ])
}

const endEvent = (props: any) => {
  Alert.alert(I18n.t('caption_end_event'), I18n.t('text_tracking_alert_stop_confirmation_message'), [
    { text: I18n.t('button_yes'), onPress: () => 'todo: stopTrackingAction' }, // todo: set event state to stop tracking
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
    text({ style: styles.headlineTop }, '1'),
    text({ style: styles.headline }, I18n.t('caption_define').toUpperCase()),
    text({ style: [styles.textExplain, styles.textLast] },
      props.entryClosed ?
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
    text({ style: styles.headlineTop }, '2'),
    text({ style: styles.headline }, I18n.t('caption_invite').toUpperCase()),
    text({ style: [styles.textExplain, styles.textLast] },
      props.entryClosed ?
      I18n.t('text_invite_competitors_long_text_running') :
      I18n.t('text_invite_competitors_long_text_planning')),
    nothingWhenEntryIsClosed(inviteCompetitorsButton),
    nothingWhenEntryIsClosed(joinAsCompetitorButton),
    qrCode
  ]))

export const closeEntryCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder4 }, nothing())),
    view({ style: styles.container4 }),
    reduce(concat, nothing()))([
    text({ style: styles.headlineTop }, '3'),
    text({ style: styles.headline }, I18n.t('caption_close').toUpperCase()),
    text({ style: [styles.textExplain, styles.textLast] }, I18n.t('text_close_entry_long_text')),
    nothingWhenEntryIsClosed(styledButton({
      onPress: (props: any) => closeEntry(props),
      style: styles.buttonBig,
    },text({ style: styles.buttonBigContent }, I18n.t('caption_close_entry').toUpperCase())))
  ]))

export const endEventCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder4 }, nothing())),
    view({ style: styles.container4 }),
    reduce(concat, nothing()))([
    text({ style: styles.headlineTop }, '3'),
    text({ style: styles.headline }, I18n.t('caption_end').toUpperCase()),
    text({ style: [styles.textExplain, styles.textLast] }, !props.trackingStopped ? I18n.t('text_end_event_long_text_running') : I18n.t('text_end_event_long_text_finished')),
    nothingWhenTrackingIsStopped(
    styledButton({
      onPress: (props: any) => endEvent(props),
      style: styles.buttonBig,
    },text({ style: styles.buttonContent }, I18n.t('caption_end_event'))))
  ]))

export default Component((props: any) => compose(
    fold(merge(props, sessionData)),
    connect(mapStateToProps, { 
      checkOut,
      collectCheckInData,
      shareSessionRegatta
    }),
    scrollView({ style: styles.container }),
    view({ style: [container.list, styles.cardsContainer] }),
    reduce(concat, nothing()))([
    sessionDetailsCard,
    defineRacesCard,
    inviteCompetitorsCard,
    closeEntryCard, // !props.entryClosed ? closeEntryCard : endEventCard, // ToDo: how and when is it closed
  ]))
