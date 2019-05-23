import { Maneuver } from 'api/endpoints/types'
import { BoatTemplate, CheckIn, Session, TrackingSession, WindFix } from 'models'
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
export const navitateToLogin = () => NavigationService.navigate(Screens.Login)
export const navitateToModalLogin = () => NavigationService.navigate(Screens.ModalLogin)
export const navitateToPasswordReset = () => NavigationService.navigate(Screens.PasswordReset)
export const navigateToSessions = () => NavigationService.navigate(Screens.Sessions)
export const navigateToTracking = () => NavigationService.navigate(Screens.Tracking)

export const navigateToManeuver = (data?: Maneuver) => NavigationService.navigate(Screens.ManeuverMonitor, { data })
export const navigateToSetWind = (data?: WindFix) => NavigationService.navigate(Screens.SetWind, { data })
export const navigateToLeaderboard = () => NavigationService.navigate(Screens.Leaderboard)
export const navigateToSessionDetail = (data: string) => NavigationService.navigate(Screens.SessionDetail, { data })
export const navigateToNewSession = (data?: TrackingSession) => NavigationService.navigate(Screens.NewSession, { data })
export const navigateToJoinRegatta = (data: CheckIn) => NavigationService.navigate(Screens.JoinRegatta, { data })
export const navigateToTrackDetails = (data?: string) => NavigationService.navigate(Screens.TrackDetails, { data })
export const navigateToBoatDetails = (data?: BoatTemplate) => NavigationService.navigate(Screens.BoatDetails, { data })
export const navigateToEditCompetitor = (data: CheckIn) => NavigationService.navigate(Screens.EditCompetitor, { data })

export const navigateToEditSession = (data?: Session) => NavigationService.navigate(
  Screens.EditSession,
  data && { data },
)
