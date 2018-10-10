import { Boat, CheckIn, Session, TrackingSession, WindFix } from 'models'
import * as  NavigationService from './NavigationService'
import * as Screens from './Screens'


export const navigateBack = NavigationService.navigateBack
export const initialNavigation = () => NavigationService.navigate(Screens.App)
export const navigateToMain = () => NavigationService.navigate(Screens.Main)
export const navigateToQRScanner = () => NavigationService.navigate(Screens.QRScanner)
export const navigateToCheckIn = () => NavigationService.navigate(Screens.CheckIn)
export const navigateToAppSettings = () => NavigationService.navigate(Screens.AppSettings)
export const navigateToUserRegistration = () => NavigationService.navigate(Screens.Register)
export const navigateToUserRegistrationCredentials = () => NavigationService.navigate(Screens.RegisterCredentials)
export const navigateToUserRegistrationBoat = () => NavigationService.navigateWithReset(Screens.RegisterBoat)
export const navitateToLogin = () => NavigationService.navigate(Screens.Login)
export const navigateToSessions = () => NavigationService.navigate(Screens.Sessions)
export const navigateToManeuverMonitor = () => NavigationService.navigate(Screens.ManeuverMonitor)

export const navigateToSetWind = (data?: WindFix) => NavigationService.navigate(Screens.SetWind, { data })
export const navigateToSessionDetail = (data: string) => NavigationService.navigate(Screens.SessionDetail, { data })
export const navigateToTracking = (data: any) => NavigationService.navigate(Screens.Tracking, { data })
export const navigateToNewSession = (data?: TrackingSession) => NavigationService.navigate(Screens.NewSession, { data })
export const navigateToJoinRegatta = (data: CheckIn) => NavigationService.navigate(Screens.JoinRegatta, { data })
export const navigateToTrackDetails = (data?: string) => NavigationService.navigate(Screens.TrackDetails, { data })
export const navigateToBoatDetails = (data?: Boat) => NavigationService.navigate(Screens.BoatDetails, { data })

export const navigateToEditSession = (data?: Session) => NavigationService.navigate(
  Screens.EditSession,
  data && { data },
)
