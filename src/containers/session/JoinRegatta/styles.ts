import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        // justifyContent: 'space-between',
        height: '100%',
        width: '100%',
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        // paddingHorizontal: '$siGutter',
        // marginTop: '$siStatusBarHeight',
        display: 'flex',
        flexDirection: 'column'
    },
    header: {
        flexDirection: 'column',
    },
    eventImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover'
    },
    poweredByLogo: {
        position:'absolute',
        width: 54,
        height: 40,
        resizeMode: 'contain',
        right: '$siGutter',
        bottom: '$siBaseSpacing * 2'
    },
    textContainer: {
        paddingHorizontal: '$siGutter',
        width: '100%'
    },
    headingBlock: {
        marginTop: '$siBaseSpacing * 4',
    },
    indentHeadingBlock: {
        marginLeft: 96
    },
    dateAndLocation: {
        flexDirection: 'row'
    },
    location: {
        marginLeft: '$siBaseSpacing * 2',
    },
    locationIcon: {
        tintColor: '$siWhite',
        height: 16,
        width: 16,
        top: -4,
        margin: 0
    },
    locationText: {
        left: -4
    },
    joinButton: {
        marginTop: '$siBaseSpacing * 2',
        marginBottom: '$siBaseSpacing * 2'
    },
    eulaField: {
        marginTop: '$siBaseSpacing * 2',
    },
    pickText: {
        marginBottom: '$siBaseSpacing',
    }
})