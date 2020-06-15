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
        paddingHorizontal: '$siGutter',
        marginTop: '$siStatusBarHeight',
        display: 'flex',
        flexDirection: 'column',
    },
    h1: {
        marginTop: 168
    },
    loginButton: {
        marginTop: '$siBaseSpacing * 2',
        marginBottom: '$siBaseSpacing * 2'
    },
    forgotPasswordLink: {
        textAlign: 'left'
    }
})