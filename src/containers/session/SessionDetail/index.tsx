import { __, always, compose, concat,
  merge, reduce, isNil, prop } from 'ramda'
import { checkOut, collectCheckInData } from 'actions/checkIn'
import { shareSessionRegatta } from 'actions/sessions'
import { startTracking } from 'actions/tracking'
import { fetchRegattaCompetitors } from 'actions/regattas'
import { Component, fold, nothing, nothingAsClass,
  recomposeBranch as branch,
  reduxConnect as connect } from 'components/fp/component'
import { scrollView, view } from 'components/fp/react-native'
import * as Screens from 'navigation/Screens'
import { BRANCH_APP_DOMAIN } from 'environment'
import { dateFromToText } from 'helpers/date'
import I18n from 'i18n'
import { getCustomScreenParamData } from 'navigation/utils'
import querystring from 'query-string'
import { canUpdateCurrentEvent } from 'selectors/permissions'
import { getRegattaCompetitorList, getRegattaPlannedRaces } from 'selectors/regatta'
import { getSession } from 'selectors/session'
import { currentUserIsCompetitorForEvent, getCheckInByLeaderboardName } from 'selectors/checkIn'
import { container } from 'styles/commons'
import {
  competitorsCard,
  racesAndScoringCard,
  sessionDetailsCard,
  typeAndBoatClassCard,
  competitorList,
  withCompetitorListState,
  competitorListRefreshHandler,
} from '../common'
import styles from './styles'

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
  const isBeforeEventStartTime =
    (session?.event?.startDate || new Date(0)) > Date.now()

  const competitorListData = getRegattaCompetitorList(session.regattaName)(state)

  return {
    session,
    checkIn,
    isBeforeEventStartTime,
    competitorList : competitorListData,
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
    isEventOrganizer: false
  }
}

const sessionData = {
  racesAndScoringOnPress: (props: any) => props.navigation.navigate(Screens.RaceDetails, { data: props.session }),
  inviteCompetitors: (props: any) => props.shareSessionRegatta(props.session.leaderboardName),
}

export default Component((props: any) =>
  compose(
    fold(merge(props, sessionData)),
    connect(mapStateToSessionDetailsProps, { checkOut, collectCheckInData, shareSessionRegatta, startTracking, fetchRegattaCompetitors }),
    scrollView({ style: styles.container, nestedScrollEnabled: true }),
    nothingIfNoSession,
    withCompetitorListState,
    view({ style: [container.list, styles.cardsContainer] }),
    reduce(concat, nothing()))([
      competitorListRefreshHandler,
      sessionDetailsCard,
      typeAndBoatClassCard,
      racesAndScoringCard,
      competitorsCard
    ]))
