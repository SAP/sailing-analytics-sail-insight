import EStyleSheets from 'react-native-extended-stylesheet'

import { text } from 'styles/commons'

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
    longFormH1: {
        marginTop: 168,
        paddingHorizontal: '$siGutter',
    },
    resetButton: {
        marginTop: '$siBaseSpacing * 2',
        marginBottom: '$siBaseSpacing * 2'
    },
    forgotPasswordLink: {
        textAlign: 'left'
    }
})
