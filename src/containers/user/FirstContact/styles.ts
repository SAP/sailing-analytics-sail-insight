import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  $sideMargin: 24,
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 2,
    display: 'flex',
    marginTop: 80,
    alignItems: 'center',
  },
  app_logo: {
    height: 155,
    width: 213,
    marginBottom: 20,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'SFProDisplay-HeavyItalic',
    marginBottom: '$largeSpacing',
  },
  logoContainer: {
    flexGrow: 0,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bigButton: {
    marginBottom: '$smallSpacing',
  },
  bigButtonTransparent: {
    alignSelf: 'stretch',
    height: 56,
    borderRadius: '$baseBorderRadius',
    marginBottom: '$smallSpacing',
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
  },
  bigButtonText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'SFProDisplay-Heavy',
  },
  loginText: {
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  ws_logo: {
    marginRight: 16,
    height: 63,
    width: 89,
  },
  sap_logo: {
    marginLeft: 16,
    height: 63,
    width: 89,
  },
})
