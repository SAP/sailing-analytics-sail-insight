import { Maneuver } from 'api/endpoints/types'
import { CheckIn, Session, TeamTemplate, TrackingSession, WindFix } from 'models'
import * as  NavigationService from './NavigationService'
import * as Screens from './Screens'


export const navigateBack = NavigationService.navigateBack
export const initialNavigation = () => NavigationService.navigate(Screens.App)
export const navigateToMain = () => NavigationService.navigate(Screens.Main)
export const navigateToQRScanner = () => NavigationService.navigate(Screens.QRScanner)
export const navigateToCheckIn = () => NavigationService.navigate(Screens.CheckIn)
export const navigateToAppSettings = () => NavigationService.navigate(Screens.AppSettings)
export const navigateToUserRegistration = () => NavigationService.navigate(Screens.Register)
export const navigateToExpertSettings = () => NavigationService.navigate(Screens.ExpertSettings)
export const navigateToUserRegistrationCredentials = () => NavigationService.navigate(Screens.RegisterCredentials)
export const navigateToUserRegistrationBoat = () => NavigationService.navigateWithReset(Screens.RegisterBoat)
export const navigateToLogin = () => NavigationService.navigate(Screens.Login)
export const navigateToModalLogin = () => NavigationService.navigate(Screens.ModalLogin)
export const navigateToPasswordReset = () => NavigationService.navigate(Screens.PasswordReset)
export const navigateToSessions = () => NavigationService.navigate(Screens.Sessions)
export const navigateToTracking = () => NavigationService.navigate(Screens.Tracking)
export const navigateToUserProfile = () => NavigationService.navigate(Screens.UserProfile)
export const navigateToTeamList = () => NavigationService.navigate(Screens.TeamList)
export const navigateToAccountList = () => NavigationService.navigate(Screens.AccountList)

export const navigateToManeuver = (data?: Maneuver) => NavigationService.navigate(Screens.ManeuverMonitor, { data })
export const navigateToSetWind = (data?: WindFix) => NavigationService.navigate(Screens.SetWind, { data })
export const navigateToLeaderboard = () => NavigationService.navigate(Screens.Leaderboard)
export const navigateToSessionDetail = (data: string) => NavigationService.navigate(Screens.SessionDetail, { data })
export const navigateToRaceDetails = (data: string) => NavigationService.navigate(Screens.RaceDetails, { data })
export const navigateToRaceSetup = (data: string) => NavigationService.navigate(Screens.RaceSetup, { data })
export const navigateToRaceCourseLayout = () => NavigationService.navigate(Screens.RaceCourseLayout)
export const navigateToNewSessionBasics = () => NavigationService.navigate(Screens.NewSessionBasics)
export const navigateToNewSessionTypeAndBoatClass = () => NavigationService.navigate(Screens.NewSessionTypeAndBoatClass)
export const navigateToNewSessionsRacesAndScoring = () => NavigationService.navigate(Screens.NewSessionRacesAndScoring)
export const navigateToNewSessionCompetitors = () => NavigationService.navigate(Screens.NewSessionCompetitors)
export const navigateToNewSessionReviewAndCreate = () => NavigationService.navigate(Screens.NewSessionReviewAndCreate)
export const navigateToJoinRegatta = (checkInData: CheckIn, alreadyJoined: boolean) =>
  NavigationService.navigate(Screens.JoinRegatta, { data: { checkInData, alreadyJoined } })
export const navigateToTrackDetails = (url?: string, eventName?: string) =>
  NavigationService.navigate(Screens.TrackDetails, { data: { url, eventName } })
export const navigateToTeamDetails = (data?: TeamTemplate) => NavigationService.navigate(Screens.TeamDetails, { data })
export const navigateToEditCompetitor = (data: CheckIn) => NavigationService.navigate(Screens.EditCompetitor, { data })

export const navigateToEditSession = (data?: Session) => NavigationService.navigate(
  Screens.EditSession,
  data && { data },
)
