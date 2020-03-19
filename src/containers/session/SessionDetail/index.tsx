import { __, always, call, compose, concat, identity, inc,
  last, merge, reduce, take, isNil, prop } from 'ramda'
import Images from '@assets/Images'
import { checkOut, collectCheckInData } from 'actions/checkIn'
import { openEventLeaderboard, openSAPAnalyticsEvent } from 'actions/events'
import { shareSessionRegatta } from 'actions/sessions'
import { Component, connectActionSheet, fold, fromClass, nothing, nothingAsClass,
  recomposeBranch as branch,
  reduxConnect as connect } from 'components/fp/component'
import { scrollView, touchableOpacity, view } from 'components/fp/react-native'
import * as Screens from 'navigation/Screens'
import IconText from 'components/IconText'
import { BRANCH_APP_DOMAIN } from 'environment'
import { dateFromToText } from 'helpers/date'
import I18n from 'i18n'
import { getCustomScreenParamData } from 'navigation/utils'
import querystring from 'query-string'
import { canUpdateCurrentEvent } from 'selectors/permissions'
import { getRegattaPlannedRaces } from 'selectors/regatta'
import { getSession } from 'selectors/session'
import { currentUserIsCompetitorForEvent, getCheckInByLeaderboardName } from 'selectors/checkIn'
import { container } from 'styles/commons'
import {
  competitorsCard,
  racesAndScoringCard,
  sessionDetailsCard,
  typeAndBoatClassCard,
} from '../common'
import styles from './styles'

const shareIcon = fromClass(IconText).contramap(always({
  source: Images.actions.share,
  iconTintColor: 'white',
  style: { justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconStyle: { width: 25, height: 25 }
}))

const nothingIfNoSession = branch(compose(isNil, prop('session')), nothingAsClass)

export const mapStateToSessionDetailsProps = (state: any, props: any) => {
  const leaderboardName = getCustomScreenParamData(props).leaderboardName
  const session = getSession(leaderboardName)(state)

  if (isNil(session)) {
    return {}
  }

  const checkIn = getCheckInByLeaderboardName(leaderboardName)(state)
  const regattaRaces = getRegattaPlannedRaces(session.regattaName)(state)

  const { serverUrl, eventId, secret } = session

  const checkInPath = querystring.stringify({
    event_id: eventId,
    leaderboard_name: leaderboardName,
    secret
  })
  const checkinUrl = `${serverUrl}/tracking/checkin?${checkInPath}`

  return {
    session,
    checkIn,
    qrCodeLink: `https://${BRANCH_APP_DOMAIN}/invite?checkinUrl=${encodeURIComponent(checkinUrl)}`,
    name: session.regattaName,
    startDate: session && session.event && dateFromToText(session.event.startDate, session.event.endDate),
    location: session && session.event && session.event.venue && session.event.venue.name,
    boatClass: session && session.regatta && session.regatta.boatClass,
    currentUserIsCompetitorForEvent: currentUserIsCompetitorForEvent(leaderboardName)(state),
    races: regattaRaces.length,
    racesButtonLabel: canUpdateCurrentEvent(state) ?
      I18n.t('text_define_races').toUpperCase() :
      I18n.t('text_see_racing_scoring').toUpperCase(),
  }
}

const sessionData = {
  racesAndScoringOnPress: (props: any) => props.navigation.navigate(Screens.RaceDetails, { data: props.session }),
  inviteCompetitors: (props: any) => props.shareSessionRegatta(props.session.leaderboardName),
}

export const ShareButton = Component(props => compose(
  fold(props),
  connect(null, { openSAPAnalyticsEvent, openEventLeaderboard }),
  connectActionSheet,
  touchableOpacity({
    onPress: props => props.showActionSheetWithOptions({
      options: ['Share SAP Analytics Link', 'Visit Overall Leaderboard', 'Cancel'],
      cancelButtonIndex: 2,
    },
    compose(
      call,
      last,
      take(__, [props.openSAPAnalyticsEvent, props.openEventLeaderboard, identity]),
      inc))
  }))(
  shareIcon))

export default Component((props: any) =>
  compose(
    fold(merge(props, sessionData)),
    connect(mapStateToSessionDetailsProps, { checkOut, collectCheckInData, shareSessionRegatta }),
    scrollView({ style: styles.container }),
    nothingIfNoSession,
    view({ style: [container.list, styles.cardsContainer] }),
    reduce(concat, nothing()))([
      sessionDetailsCard,
      typeAndBoatClassCard,
      racesAndScoringCard,
      competitorsCard
    ]))
