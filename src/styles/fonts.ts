import { isPlatformAndroid } from 'helpers/environment'

export const $defaultFontFamily = isPlatformAndroid ? 'bentonsans_regular' : 'BentonSans Regular'
export const $defaultBoldFontFamily = isPlatformAndroid ? 'bentonsans_bold' : 'BentonSans Bold'

export const $microFontSize = 8
export const $smallFontSize = 11
export const $regularFontSize = 12
export const $regularLargeFontSize = 13
export const $largeFontSize = 16
export const $titleFontSize = 20
