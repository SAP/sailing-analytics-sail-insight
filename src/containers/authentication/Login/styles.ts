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
  },
  inputContainer: {
    backgroundColor: 'transparent',
  },
  inputStyle: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  password: {
    marginTop: 16,
  },
  forgotPassword: {
    marginTop: '$tinySpacing',
    color: '#FFFFFF',
    fontSize: 20,
  },
  forgotPwText: {
    color: 'white',
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
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
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  inputField: {
    flex: 1,
    paddingBottom: 37,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
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
    marginBottom: 'auto',
    backgroundColor: '#FD3737',
    borderRadius: '$baseBorderRadius',
    position: 'relative',
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  redBalloonText: {
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: '$tinySpacing',
    marginBottom: '$tinySpacing',
  },
  attention: {
    position: 'absolute',
    left: 20,
    height: '100%',
    width: 16,
  },
})
