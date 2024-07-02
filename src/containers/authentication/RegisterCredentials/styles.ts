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
        justifyContent: 'flex-start',
        marginTop: '$siStatusBarHeight',
        display: 'flex',
        flexDirection: 'column',
    },
    h1: {
        paddingHorizontal: '$siGutter',
        marginTop: 168
    },
    eulaField: {
        marginTop: '$siBaseSpacing',
        marginBottom: '$siBaseSpacing * 2'
    },
    registerButton: {
        marginBottom: '$siBaseSpacing * 2'
    }
})
