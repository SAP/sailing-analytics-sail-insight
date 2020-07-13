import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        height: '100%',
        width: '100%',
    },
    scrollContainer: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '$siTransparent',
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '$siGutter',
        marginTop: '$siStatusBarHeight',
        display: 'flex',
        flexDirection: 'column',
    },
    h1: {
        marginTop: 168
    },
    bottomContainer: {
        flexGrow: 0,
        alignSelf: 'stretch',
        display: 'flex',
        flexDirection: 'column',
    },
    startTrackingButton: {
        marginTop: '$siBaseSpacing * 2',
        marginBottom: '$siBaseSpacing * 1'
    },
    scanQRCodeButton: {
        marginTop: '$siBaseSpacing * 1',
        marginBottom: '$siBaseSpacing * 3'
    },
    forgotPasswordLink: {
        textAlign: 'left'
    }
})
