import { CheckIn, Session } from 'models'
import * as  NavigationService from './NavigationService'
import * as Screens from './Screens'


export const navigateBack = NavigationService.navigateBack
export const initialNavigation = () => NavigationService.navigateWithReset(Screens.MainTabs)
export const navigateToQRScanner = (params: any) => NavigationService.navigate(Screens.QRScanner, params)
export const navigateToCheckIn = () => NavigationService.navigate(Screens.CheckIn)
export const navigateToSessionDetail = (params: any) => NavigationService.navigate(Screens.SessionDetail, params)
export const navigateToAppSettings = () => NavigationService.navigate(Screens.AppSettings)
export const navigateToTracking = (params: any) => NavigationService.navigate(Screens.Tracking, params)
export const navigateToNewSession = (session: Session) => NavigationService.navigate(Screens.NewSession, session)
export const navigateToUserRegistration = () => NavigationService.navigate(Screens.Register)
export const navigateToUserRegistrationCredentials = () => NavigationService.navigate(Screens.RegisterCredentials)
export const navigateToUserRegistrationBoat = () => NavigationService.navigateWithReset(Screens.RegisterBoat)
export const navitateToLogin = () => NavigationService.navigate(Screens.Login)
export const navigateToJoinRegatta = (params: CheckIn) => NavigationService.navigate(Screens.JoinRegatta, params)
export const navigateToSessions = () => NavigationService.navigate(Screens.Sessions)
export const navigateToManeuverMonitor = () => NavigationService.navigate(Screens.ManeuverMonitor)
export const navigateToEditSession = (session: Session) => NavigationService.navigate(Screens.EditSession, session)
export const navigateToSetWind = () => NavigationService.navigate(Screens.SetWind)
