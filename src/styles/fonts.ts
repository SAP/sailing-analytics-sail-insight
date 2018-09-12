import { isPlatformAndroid } from 'helpers/environment'

export const $defaultFontFamily = isPlatformAndroid ? 'bentonsans_regular' : 'BentonSans Regular'
export const $defaultBoldFontFamily = isPlatformAndroid ? 'bentonsans_bold' : 'BentonSans Bold'

export const $paragraphFontSize = 13
export const $subParagraphFontSize = 11

export const $bottomTabItemFontSize = 12
export const $topTabItemFontSize = 14

export const $claimFontSize = 20
