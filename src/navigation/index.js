import NavigationService from './NavigationService'
import * as Screens from './Screens'

export const navigateToQRScanner = params => NavigationService.navigate(Screens.QRScanner, params)

export const navigateToCheckIn = () => NavigationService.navigate(Screens.CheckIn)
