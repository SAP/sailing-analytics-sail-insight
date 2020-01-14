import Images from '@assets/Images'
import { checkOut, collectCheckInData } from 'actions/checkIn'
import { openEventLeaderboard, openSAPAnalyticsEvent } from 'actions/events'
import { shareSessionRegatta } from 'actions/sessions'
import { Component, connectActionSheet, fold, fromClass, nothing, reduxConnect as connect } from 'components/fp/component'
import { iconText, scrollView, text, touchableOpacity, view } from 'components/fp/react-native'
import IconText from 'components/IconText'
import { dateFromToText } from 'helpers/date'
import I18n from 'i18n'
import { navigateToRaceDetails } from 'navigation'
import { getCustomScreenParamData } from 'navigation/utils'
import { __, always, call, compose, concat, curry, identity, inc, last, merge, reduce, take, toUpper } from 'ramda'
import { Alert } from 'react-native';
import { canUpdateCurrentEvent } from 'selectors/permissions'
import { getRegattaPlannedRaces } from 'selectors/regatta'
import { getSession } from 'selectors/session'
import { container } from 'styles/commons'
import styles from './styles'

const shareIcon = fromClass(IconText).contramap(always({
  source: Images.actions.share,
  iconTintColor: 'white',
  style: { justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconStyle: { width: 25, height: 25 }
}))

const styledButton = curry(({ onPress }, content: any) => Component((props: any) => compose(
  fold(props),
  touchableOpacity({ onPress }))(
  view({ style: styles.button }, content))))

const mapStateToProps = (state: any, props: any) => {
  const leaderboardName = getCustomScreenParamData(props)
  const session = getSession(leaderboardName)(state)
  const regattaRaces = getRegattaPlannedRaces(session.regattaName)(state)

  return {
    session,
    name: session.regattaName,
    startDate: session && session.event && dateFromToText(session.event.startDate, session.event.endDate) || '? ? ?',
    location: session && session.event && session.event.venue && session.event.venue.name || '',
    boatClass: session && session.boat && session.boat.boatClass || '',
    raceStatus: '? ? ?', //'Race 1 is currently running', or 'Event is open' ....
    discardRaces: '? ? ?', // like '2 | 4 | 6'
    races: regattaRaces.length,
    racesButtonLabel: canUpdateCurrentEvent(state) ?
      I18n.t('text_define_races').toUpperCase() :
      I18n.t('text_see_racing_scoring').toUpperCase(),
  }
}

const sessionData = {
  racesAndScoringOnPress: (props: any) => navigateToRaceDetails(props.session),
  inviteCompetitors: (props: any) => props.shareSessionRegatta(props.session.leaderboardName),
}

const closeEntry = (props: any) => {
  Alert.alert('Start Tracking', 'You really want to start tracking?\nEvent entry will be closed.', [
    { text: 'Yes', onPress: () => props.closeEntry && props.closeEntry(props) }, // todo: set event state to entry closed
    { text: 'No' },
  ])
}

const endEvent = (props: any) => {
  Alert.alert('End Event', 'You really want to stop tracking?', [
    { text: 'Yes', onPress: () => props.endEvent && props.endEvent(props) }, // todo: set event state to stop tracking
    { text: 'No' },
  ])
}

export const sessionDetailsCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder1 }, nothing())),
    view({ style: styles.container1 }),
    reduce(concat, nothing()),
  )([
    text({ style: styles.textLight }, props.startDate),
    text({ style: styles.headlineHeavy }, props.name),
    iconText({
      style: styles.location,
      iconStyle: styles.locationIcon,
      textStyle: [props.boatClass !== '' ? styles.textValue : styles.textLast, styles.textValue],
      source: Images.info.location,
      alignment: 'horizontal'}, props.location),
    props.boatClass !== '' ?
    inlineText( { style: styles.textLast }, [
      text({ style: styles.textLight }, 'Boat Class '),
      text({ style: styles.textValue }, props.boatClass),
    ]) : nothing()
  ]),
)

export const defineRacesCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder2 }, nothing())),
    view({ style: styles.container2 }),
    reduce(concat, nothing()),
  )([
    text({ style: styles.headlineTop }, '1'),
    text({ style: styles.headline }, 'Define'.toUpperCase()),
    text({ style: [styles.textExplain, styles.textLast] }, I18n.t('text_define_races_long_text')),
    styledButton({
      onPress: (props: any) => props.racesAndScoringOnPress && props.racesAndScoringOnPress(props),
    }, text({ style: styles.buttonContent }, toUpper(props.racesButtonLabel)))
  ]),
)

export const inviteCompetitorsCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder3 }, nothing())),
    view({ style: styles.container3 }),
    reduce(concat, nothing()),
  )([
    text({ style: styles.headlineTop }, '2'),
    text({ style: styles.headline }, 'Invite'.toUpperCase()),
    text({ style: [styles.textExplain, styles.textLast] }, I18n.t('text_invite_competitors_long_text')),
    styledButton({
      onPress: (props: any) => props.inviteCompetitors && props.inviteCompetitors(props),
    }, text({ style: styles.buttonContent }, 'INVITE COMPETITORS'))
  ]),
)

export const closeEntryCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder4 }, nothing())),
    view({ style: styles.container4 }),
    reduce(concat, nothing())
  )([
    text({ style: styles.headlineTop }, '3'),
    text({ style: styles.headline }, 'Close'.toUpperCase()),
    text({ style: [styles.textExplain, styles.textLast] }, I18n.t('text_close_entry_long_text')),
    styledButton({
      onPress: (props: any) => closeEntry,
    }, text({ style: styles.buttonContent }, 'CLOSE ENTRY'))
  ]),
)

export const endEventCard = Component((props: any) => compose(
    fold(props),
    concat(__, view({ style: styles.containerAngledBorder4 }, nothing())),
    view({ style: styles.container4 }),
    reduce(concat, nothing())
  )([
    text({ style: styles.headlineTop }, '3'),
    text({ style: styles.headline }, 'End'.toUpperCase()),
    text({ style: [styles.textExplain, styles.textLast] }, I18n.t('text_end_event_long_text')),
    styledButton({
      onPress: (props: any) => endEvent(props),
    }, text({ style: styles.buttonContent }, 'END EVENT'))
  ]),
)

export const ShareButton4Organizer = Component(props => compose(
  fold(props),
  connect(null, { openSAPAnalyticsEvent, openEventLeaderboard }),
  connectActionSheet,
  touchableOpacity({
    onPress: props => props.showActionSheetWithOptions({
      options: ['Share SAP Analytics link', 'Visit overall leaderboard', 'Cancel'],
      cancelButtonIndex: 2,
    },
    compose(
      call,
      last,
      take(__, [props.openSAPAnalyticsEvent, props.openEventLeaderboard, identity]),
      inc))
  }))(
  shareIcon))

export default Component((props: any) => compose(
    fold(merge(props, sessionData)),
    connect(mapStateToProps, { checkOut, collectCheckInData, shareSessionRegatta }),
    scrollView({ style: styles.container }),
    view({ style: [container.list, styles.cardsContainer] }),
    reduce(concat, nothing()))([
      sessionDetailsCard,
      defineRacesCard,
      inviteCompetitorsCard,
      1 != 0 ? closeEntryCard : endEventCard, // ToDo: how and when is it closed
    ]))
