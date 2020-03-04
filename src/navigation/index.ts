import { Maneuver } from 'api/endpoints/types'
import { CheckIn, Session, TeamTemplate, WindFix } from 'models'
import * as  NavigationService from './NavigationService'
import * as Screens from './Screens'


export const navigateBack = NavigationService.navigateBack
export const navigatePop = NavigationService.pop
export const initialNavigation = () => NavigationService.navigate(Screens.App)
export const navigateToMain = () => NavigationService.navigate(Screens.Main)
export const navigateToQRScanner = () => NavigationService.navigate(Screens.QRScanner)
export const navigateToAppSettings = () => NavigationService.navigate(Screens.AppSettings)
export const navigateToUserRegistration = () => NavigationService.navigate(Screens.Register)
export const navigateToExpertSettings = () => NavigationService.navigate(Screens.ExpertSettings)
export const navigateToUserRegistrationBoat = () => NavigationService.navigate(Screens.RegisterBoat)
export const navigateToLogin = () => NavigationService.navigate(Screens.Login)
export const navigateToLoginFromSplash = () => NavigationService.navigate(Screens.LoginFromSplash)
export const navigateToPasswordReset = () => NavigationService.navigate(Screens.PasswordReset)
export const navigateToSessions = () => NavigationService.navigate(Screens.Main, { screen: Screens.MainTabs, params: { screen: Screens.Sessions } })
export const navigateToTrackingNavigator = () => NavigationService.navigate(Screens.Main, { screen: Screens.MainTabs, params: { screen: Screens.TrackingNavigator } })
export const navigateToTracking = () => NavigationService.navigate(Screens.Tracking)
export const navigateToUserProfile = () => NavigationService.navigate(Screens.UserProfile)
export const navigateToTeamList = () => NavigationService.navigate(Screens.TeamList)

export const navigateToTrackingList = () => NavigationService.navigate(Screens.TrackingList)
export const navigateToManeuver = (data?: Maneuver) => NavigationService.navigate(Screens.ManeuverMonitor, { data })
export const navigateToSetWind = (data?: WindFix) => NavigationService.navigate(Screens.SetWind, { data })
export const navigateToLeaderboard = () => NavigationService.navigate(Screens.Leaderboard)
export const navigateToSessionDetail = (data: Object) => NavigationService.navigate(Screens.SessionDetail, { data })
export const navigateToOrganizerSessionDetail = (data: Object) => NavigationService.navigate(Screens.SessionDetail4Organizer, { data })
export const navigateToRaceDetails = (data: string) => NavigationService.navigate(Screens.RaceDetails, { data })
export const navigateToRaceCourseLayout = () => NavigationService.navigate(Screens.RaceCourseLayout)
export const navigateToCourseGeolocation = (data: object) => NavigationService.navigate(Screens.CourseGeolocation, { data })
export const navigateToCourseTrackerBinding = (data: object) => NavigationService.navigate(Screens.CourseTrackerBinding, { data })
export const navigateToEventCreation = () => NavigationService.navigate(Screens.EventCreation)
export const navigateToJoinRegatta = (checkInData: CheckIn, alreadyJoined: boolean) =>
  NavigationService.navigate(Screens.JoinRegatta, { data: { checkInData, alreadyJoined } })
export const navigateToTrackDetails = (url?: string, eventName?: string) =>
  NavigationService.navigate(Screens.TrackDetails, { data: { url, eventName } })
export const navigateToTeamDetails = (data?: TeamTemplate) => NavigationService.navigate(Screens.TeamDetails, { data })
export const navigateToEditCompetitor = (data: CheckIn, options?: object) => NavigationService.navigate(Screens.EditCompetitor, { data, options })

export const navigateToEditSession = (data?: Session) => NavigationService.navigate(
  Screens.EditSession,
  data && { data },
)
