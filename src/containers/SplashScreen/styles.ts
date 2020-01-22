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
    paddingBottom: 130,
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
