import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#12374866',
  },
  textContainer: {
    flex: 1,
    marginTop: 90,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  inputContainer: {
    backgroundColor: 'transparent',
  },
  userName: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  password: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
    marginTop: 16,
  },
  forgotPassword: {
    marginTop: 16,
    color: '#FFFFFF',
    fontSize: 20,
  },
  loginButton: {
    backgroundColor: '#FF6C52',
    marginTop: 20,
    alignSelf: 'stretch',
    height: 56,
    borderRadius: '$baseBorderRadius',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'SFProDisplay-Heavy',
  },
  claim: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Heavy',
  },
  inputField: {
    flex: 1,
    paddingLeft: '$mediumSpacing',
    paddingRight: '$mediumSpacing',
    paddingBottom: 37,
  },
  bottomButtonField: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 150,
    marginTop: 'auto',
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
  },
  redBalloon: {
    marginTop: '$smallSpacing',
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
    paddingBottom: '$tinySpacing',
    marginBottom: 'auto',
    backgroundColor: '#FD3737',
    borderRadius: '$baseBorderRadius',

  },
  redBalloonText: {
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: '$tinySpacing',
    paddingLeft: 20,
    paddingRight: 20,
  },
})
