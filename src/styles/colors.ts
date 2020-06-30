import { Platform } from 'react-native'
import { addOpacity } from 'helpers/color'

export const $primaryBackgroundColor = '#1D3F4E'
export const $secondaryBackgroundColor = '#EEEEEE'
export const $placeholderBackgroundColor = '#FFFFFF1A' // '#008FD31A'

export const $primaryButtonColor = '#F0AB00' // '#008FD3'
export const $secondaryButtonColor = 'black'
export const $importantHighlightColor = '#FD3737' // new red

export const $improvementColor = '#7ED321'
export const $declineColor = '#FD3737' // new red

export const $primaryTextColor = '#FFFFFF' // 'black'
export const $secondaryTextColor = '#EEEEEE' // '#777777'
export const $detailsTextColor = '#333333'

export const $primaryActiveColor = '#F0AB00'
export const $primaryInactiveColor = '#D9D9D9'
export const $activeTagColor = '#F0AB00'

export const $headerTintColor = '#FFFFFF' // 'black'

export const $DarkBlue   = '#123748'
export const $LightDarkBlue = '#264756'
export const $MediumBlue = '#476987'
export const $LightBlue  = '#4B7B90'

export const $Orange = '#F0AB00'
export const $delimiterColor = '#E2E2E2'

/**
 * v2.x Styles
 */

export const $siTransparent = 'transparent'

export const $siMediumBlue = '#476987'
export const $siDarkBlue = '#123748'
export const $siDarkerBlue = '#113242'

export const $siSapYellow = '#f0ab00'

export const $siErrorRed = $siSapYellow

export const $siBlack = '#000000'
export const $siWhite = '#ffffff'
export const $siPlaceholderBackgroundColor = addOpacity($siDarkerBlue, 0.8) // '#008FD31A'


export const $siShadow = Platform.select({
    ios: {
        shadowColor: $siBlack,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1
    },
    android: {
        elevation: 1
    }
})