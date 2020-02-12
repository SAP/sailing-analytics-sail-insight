import { isPlatformAndroid } from 'environment'

export const $defaultFontFamily = isPlatformAndroid ? 'sfcompact_regular' : 'BentonSans Regular'
export const $defaultBoldFontFamily = isPlatformAndroid ? 'sfcompact_bold' : 'BentonSans Bold'
export const $defaultUniversalFontFamily = isPlatformAndroid ? 'sfcompact_regular' : 'SFCompactText-Regular'
export const $defaultUniversalBoldFontFamily = isPlatformAndroid ? 'sfcompact_bold' : 'SFCompactText-Bold'
export const $secondaryLightFontFamily = "SFProDisplay-Light"
export const $secondaryMediumFontFamily = "SFProDisplay-Medium"
export const $secondaryBoldFontFamily = "SFProDisplay-Bold"
export const $secondaryHeavyFontFamily = "SFProDisplay-Heavy"
export const $secondaryHeavyItalicFontFamily = "SFProDisplay-HeavyItalic"
export const $tertiaryFontFamily = 'FloodStd'

export const $microFontSize = 8
export const $smallFontSize = 11
export const $regularFontSize = 12
export const $regularLargeFontSize = 14
export const $largeFontSize = 16
export const $titleFontSize = 20
