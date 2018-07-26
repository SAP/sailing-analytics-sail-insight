import NavigationService from './NavigationService'
import * as Screens from './Screens'

export const navigateToQRScanner = () => NavigationService.navigate(Screens.QRScanner)

export const navigateToCheckIn = () => NavigationService.navigate(Screens.CheckIn)
