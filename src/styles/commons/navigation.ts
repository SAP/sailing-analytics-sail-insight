import { sanFranciscoSpacing } from 'react-native-typography'

import { isPlatformAndroid } from 'environment'

import { $siRegularFontStack, $siSemiboldFontStack } from 'styles/fonts'

import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        paddingRight: 32,
        paddingLeft: 32,
    },
    heading: Object.assign({
        color: '$siWhite', // quickfix to set dyn. title in teamdetails to white
        textAlign: 'center',
        alignSelf: 'center',
        ...$siSemiboldFontStack,
        fontSize: 17,
        lineHeight: 16,
    }, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(17),
    }),
    headingSmall: Object.assign({
        color: '$siWhite',
        textAlign: 'center',
        alignSelf: 'center',
        ...$siSemiboldFontStack,
        fontSize: 14,
        lineHeight: 16,
    }, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(14),
    }),
    subHeading: Object.assign({
        color: '$siWhite',
        textAlign: 'center',
        alignSelf: 'center',
        ...$siRegularFontStack,
        fontSize: 11,
        lineHeight: 16,
    }, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(11),
    })
})
