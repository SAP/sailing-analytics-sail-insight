import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  $sideMargin: 24,
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  logo: {
    marginLeft: '$sideMargin',
    marginRight: '$sideMargin',
    resizeMode: 'contain',
    height: 300,
    flex: 1,
  },
  activityIndicatorContainer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: '20%',
  },
  activityIndicator: {
    width: 80,
    height: 80,
  },
})
