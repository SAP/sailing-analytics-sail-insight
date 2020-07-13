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
        display: 'flex',
        flexDirection: 'column',
    },
    saveButton: {
        marginTop: '$siBaseSpacing * 2',
        marginBottom: '$siBaseSpacing * 2'
    }
})