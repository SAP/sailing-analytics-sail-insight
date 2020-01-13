import Images from '@assets/Images'
import querystring from 'query-string'
import { checkOut, collectCheckInData } from 'actions/checkIn'
import { openEventLeaderboard, openSAPAnalyticsEvent } from 'actions/events'
import { shareSessionRegatta } from 'actions/sessions'
import { Component, connectActionSheet, fold, fromClass, nothing, reduxConnect as connect } from 'components/fp/component'
import { scrollView, touchableOpacity, view } from 'components/fp/react-native'
import IconText from 'components/IconText'
import { dateFromToText } from 'helpers/date';
import I18n from 'i18n';
import { navigateToRaceDetails } from 'navigation'
import { getCustomScreenParamData } from 'navigation/utils'
import { __, always, call, compose, concat, identity, inc, last, merge, reduce, take } from 'ramda'
import { canUpdateCurrentEvent } from 'selectors/permissions'
import { getRegattaPlannedRaces } from 'selectors/regatta'
import { getSession } from 'selectors/session'
import { container } from 'styles/commons'
import { BRANCH_APP_DOMAIN } from 'environment'
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

const mapStateToProps = (state: any, props: any) => {
  const leaderboardName = getCustomScreenParamData(props)
  const session = getSession(leaderboardName)(state)
  const regattaRaces = getRegattaPlannedRaces(session.regattaName)(state)

  const { serverUrl, eventId, secret } = session

  const path = querystring.stringify({
    event_id: eventId,
    leaderboard_name: leaderboardName,
    secret
  })
  const checkinUrl = `${serverUrl}/tracking/checkin?${path}`

  return {
    session,
    qrCodeLink: `https://${BRANCH_APP_DOMAIN}/invite?checkinUrl=${encodeURIComponent(checkinUrl)}`,
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

export const ShareButton = Component(props => compose(
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

export default Component((props: any) =>
  compose(
    fold(merge(props, sessionData)),
    connect(mapStateToProps, { checkOut, collectCheckInData, shareSessionRegatta }),
    scrollView({ style: styles.container }),
    view({ style: [container.list, styles.cardsContainer] }),
    reduce(concat, nothing()))([
      sessionDetailsCard,
      typeAndBoatClassCard,
      racesAndScoringCard,
      competitorsCard,
    ]))
