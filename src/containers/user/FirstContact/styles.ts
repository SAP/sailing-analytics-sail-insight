import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: '$siGutter',
        marginTop: '$siStatusBarHeight',
        display: 'flex',
        flexDirection: 'column'
    },
    appLogo: {
        width: '80%',
        flexGrow: 8,
        marginBottom: '$siBaseSpacing * 3'
    },
    buttonContainer: {
        flexGrow: 5,
        alignSelf: 'stretch',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column'
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
    wsLogo: {
        marginRight: '$siGutter'
    },
    sapLogo: {
        marginHorizontal: '$siGutter / 2'
    },
})
