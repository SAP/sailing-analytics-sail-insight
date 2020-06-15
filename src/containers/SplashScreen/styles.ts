import EStyleSheets from 'react-native-extended-stylesheet'
import { withSecondaryHeavyItalicFont } from 'styles/compositions/text'

export default EStyleSheets.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%'
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '$siGutter',
        marginTop: '$siStatusBarHeight',
        display: 'flex',
        flexDirection: 'column',
    },
    sponsorLogoContainer: {
        flexGrow: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '$siGutter',
        marginBottom: '$siBaseSpacing * 6',
        display: 'flex',
        flexDirection: 'row',
    },
    appLogo: {
        width: '80%',
        height: '62%',
        marginBottom: '$siBaseSpacing * 3'
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: 20,
        ...withSecondaryHeavyItalicFont,
    },
    wsLogo: {
        marginRight: '$siGutter'
    },
    sapLogo: {
        marginHorizontal: '$siGutter / 2'
    },
    syrfLogo: {
        marginLeft: '$siGutter'
    }
})
