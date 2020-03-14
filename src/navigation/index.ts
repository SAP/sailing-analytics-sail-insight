import { CheckIn, Session, TeamTemplate, WindFix } from 'models'
import * as  NavigationService from './NavigationService'
import * as Screens from './Screens'

export const navigateToJoinRegatta = (checkInData: CheckIn, alreadyJoined: boolean) =>
  NavigationService.navigate(Screens.JoinRegatta, { data: { checkInData, alreadyJoined } })
