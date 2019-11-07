import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  $sideMargin: 24,
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0)',
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
    fontSize: 14,
    fontFamily: 'Signika-Regular',
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
