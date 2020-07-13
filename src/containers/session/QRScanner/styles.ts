import EStyleSheets from 'react-native-extended-stylesheet'
import { sanFranciscoSpacing } from 'react-native-typography'

import { Dimensions } from 'react-native'

import { isPlatformAndroid } from 'environment'

import { $siSemiboldFontStack } from 'styles/fonts'
import { $siBaseSpacing } from 'styles/dimensions'
import { $siShadow } from 'styles/colors'

export default EStyleSheets.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%'
    },
    camera: {
        height: '100%',
        width: '100%',
    },
    marker: {
        height: Dimensions.get('window').width * 0.62,
        width: Dimensions.get('window').width * 0.62,
        borderWidth: '$siBaseSpacing / 2',
        borderColor: '$siWhite',
        backgroundColor: 'transparent',
        borderRadius: '$siBorderRadius * 5',
        ...$siShadow
    },
    bottomInfoField: {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: (Dimensions.get('window').height * 0.5) + (Dimensions.get('window').width * 0.62 / 2) + ($siBaseSpacing * 6),
        left: 0,
        right: 0,
        marginHorizontal: '$siGutter'
    },
    infoBalloon: {
        paddingHorizontal: '$siBaseSpacing',
        paddingVertical: '$siBaseSpacing',
        borderRadius: '$siBorderRadius',
        backgroundColor: '$siSapYellow',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    infoBalloonText: Object.assign({
        color: '$siWhite',
        ...$siSemiboldFontStack,
        textAlign: 'center',
    }, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(24),
    }),
})
