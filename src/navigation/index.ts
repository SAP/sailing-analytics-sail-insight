import NavigationService from './NavigationService'
import * as Screens from './Screens'

export const navigateToQRScanner = (params: any) => NavigationService.navigate(Screens.QRScanner, params)

export const navigateToCheckIn = () => NavigationService.navigate(Screens.CheckIn)

export const navigateToRegattaDetail = (params: any) => NavigationService.navigate(Screens.RegattaDetail, params)
