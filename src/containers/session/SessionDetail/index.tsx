import { compose, concat, merge, reduce, always, take, call, __, identity, last, inc } from 'ramda'
import { openSAPAnalyticsEvent, openEventLeaderboard } from 'actions/events'
import { checkOut, collectCheckInData } from 'actions/checkIn'
import { navigateToRaceDetails } from 'navigation'
import { getCustomScreenParamData } from 'navigation/utils'
import { getRegattaPlannedRaces } from 'selectors/regatta'
import { getSession } from 'selectors/session'
import { canUpdateCurrentEvent } from 'selectors/permissions'
import Images from '@assets/Images'
import IconText from 'components/IconText'
import { Component, fold, nothing, reduxConnect as connect, fromClass, connectActionSheet } from 'components/fp/component'
import { scrollView, view, touchableOpacity } from 'components/fp/react-native'
import { shareSessionRegatta } from 'actions/sessions'
import { container } from 'styles/commons'
import styles from './styles'
import {
  competitorsCard,
  // overallStatusCard,
  racesAndScoringCard,
  sessionDetailsCard,
  typeAndBoatClassCard,
} from '../common'

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

  return {
    session,
    name: session.regattaName,
    races: regattaRaces.length,
    racesButtonLabel: canUpdateCurrentEvent(state) ? 'Define Races' : 'See Races & Scoring'
  }
}

const sessionData = {
  startDate: '10.07.2019',
  overallStatus: 'Everything is good',
  handicapType: 'Handicap Regatta',
  ratingSystem: 'Rating System',
  raceStatus: 'Race 1 is currently running',
  trackingStatus: 'All trackers are sending location updates',
  rankingType: 'One Design Regatta',
  scoring: 'Low Point Scoring',
  discardRace: 3,
  registrationType: 'Unmanaged Regatta',
  entries: 7,
  invitations: 4,
  acceptations: 2,
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
      // overallStatusCard,
      sessionDetailsCard,
      typeAndBoatClassCard,
      racesAndScoringCard,
      competitorsCard,
    ]))
