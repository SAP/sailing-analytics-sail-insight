import { isPlatformAndroid } from 'environment'
import { sanFranciscoWeights, robotoWeights } from 'react-native-typography'

export const $defaultFontFamily = isPlatformAndroid ? 'sfcompact_regular' : 'SFCompactText-Regular'
export const $defaultBoldFontFamily = isPlatformAndroid ? 'sfcompact_bold' : 'SFCompactText-Bold'
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


/**
 * v2.x Styles
 */

// Thin ( Auto changeover for Text/Display)
export const $siThinFontStack = isPlatformAndroid ? {
    fontFamily: 'System', // Roboto
    ...robotoWeights.thin
} : {
    fontFamily: 'System', // San Francisco
    ...sanFranciscoWeights.thin
}


// Regular ( Auto changeover for Text/Display)
export const $siRegularFontStack = isPlatformAndroid ? {
    fontFamily: 'System', // Roboto
    ...robotoWeights.regular
} : {
    fontFamily: 'System', // San Francisco
    ...sanFranciscoWeights.regular
}

// Medium ( Auto changeover for Text/Display)
export const $siMediumFontStack = isPlatformAndroid ? {
    fontFamily: 'System', // Roboto
    ...robotoWeights.medium
} : {
    fontFamily: 'System', // San Francisco
    ...sanFranciscoWeights.medium
}

// Semibold ( Auto changeover for Text/Display)
export const $siSemiboldFontStack = isPlatformAndroid ? {
    fontFamily: 'System', // Roboto
    ...robotoWeights.medium // Use medium instead
} : {
    fontFamily: 'System', // San Francisco
    ...sanFranciscoWeights.semibold
}

// Bold ( Auto changeover for Text/Display)
export const $siBoldFontStack = isPlatformAndroid ? {
    fontFamily: 'System', // Roboto
    ...robotoWeights.bold
} : {
    fontFamily: 'System', // San Francisco
    ...sanFranciscoWeights.bold
}

// Heavy ( Auto changeover for Text/Display)
export const $siHeavyFontStack = isPlatformAndroid ? {
    fontFamily: 'System', // Roboto
    ...robotoWeights.bold // Use bold instead
} : {
    fontFamily: 'System', // San Francisco
    ...sanFranciscoWeights.heavy
}
