import EStyleSheet from 'react-native-extended-stylesheet'
import { sanFranciscoSpacing } from 'react-native-typography'

import { isPlatformAndroid } from 'environment'

import { $siMediumFontStack, $siBoldFontStack } from 'styles/fonts'
import { $addDebuggingBorder } from 'styles/dimensions'

const oldTextStyles = {
    propertyName: {
        fontSize: '$regularFontSize',
        fontWeight: '500',
        color: '$secondaryTextColor',
    },
    itemName: {
        fontSize: '$largeFontSize',
        fontWeight: 'bold',
    },
    propertyValue: {
        fontSize: '$largeFontSize',
        fontWeight: '300',
    },
    error: {
        color: '$importantHighlightColor',
    },
    claim: {
        alignSelf: 'stretch',
        fontSize: '$titleFontSize',
        fontWeight: 'bold',
        color: 'white',
    },
    claimHighlighted: {
        color: '$primaryActiveColor',
    },
    assistiveText: {
        marginLeft: '$smallSpacing',
        marginRight: '$smallSpacing',
        marginTop: 2,
        color: '$secondaryTextColor',
    },
}

export default EStyleSheet.create({
    // Keep these around for now
    ...oldTextStyles,

    h1: Object.assign({
        color: '$siWhite',
        fontSize: 34,
        lineHeight: 36,
        paddingBottom: '$siBaseSpacing * 4',
        textAlign: 'left',
        alignSelf: 'flex-start',
        // ...$addDebuggingBorder,
        ...$siBoldFontStack,
    }, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(34),
    }),

    longFormH1: Object.assign({
        color: '$siWhite',
        fontSize: 18,
        lineHeight: 24,
        paddingBottom: '$siBaseSpacing * 4',
        textAlign: 'left',
        alignSelf: 'flex-start',
        // ...$addDebuggingBorder,
        ...$siBoldFontStack,
    }, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(18),
    }),

    h2: Object.assign({
        color: '$siWhite',
        fontSize: 28,
        lineHeight: 32,
        paddingBottom: '$siBaseSpacing * 4',
        textAlign: 'left',
        alignSelf: 'flex-start',
        // ...$addDebuggingBorder,
        ...$siBoldFontStack,
    }, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(28),
    }),

    caption: Object.assign({
        color: '$siWhite',
        fontSize: 11,
        lineHeight: 16,
        paddingBottom: '$siBaseSpacing',
        textAlign: 'left',
        alignSelf: 'flex-start',
        ...$siMediumFontStack,
    }, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(11),
    }),

    text: Object.assign({
        color: '$siWhite',
        fontSize: 13,
        lineHeight: 16,
        paddingBottom: '$siBaseSpacing',
        textAlign: 'left',
        alignSelf: 'flex-start',
        ...$siMediumFontStack,
    }, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(13),
    }),

    mediumText: Object.assign({
        color: '$siWhite',
        fontSize: 15,
        lineHeight: 20,
        paddingBottom: '$siBaseSpacing',
        textAlign: 'left',
        alignSelf: 'flex-start',
        ...$siMediumFontStack,
    }, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(15),
    }),

    yellow: {
        color: '$siSapYellow'
    }

})
