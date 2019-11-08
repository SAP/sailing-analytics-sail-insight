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
  claim: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Heavy',
  },
  inputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  inputField: {
    flex: 1,
    paddingLeft: '$mediumSpacing',
    paddingRight: '$mediumSpacing',
    paddingBottom: 37,
  },
  textInput: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  lowerTextInput: {
    marginTop: '$smallSpacing',
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  taskTextSize: {
    fontSize: '$regularLargeFontSize',
  },
  taskText: {
    fontWeight: '300',
    marginTop: '$smallSpacing',
    marginBottom: '$smallSpacing',
  },
  bottomButtonField: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 150,
    marginTop: 'auto',
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
  },
  registrationButton: {
    backgroundColor: '#FF6C52',
    marginTop: 20,
    alignSelf: 'stretch',
    height: 56,
    borderRadius: '$baseBorderRadius',
  },
  registrationButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'SFProDisplay-Heavy',
  },
  loginText: {
    marginTop: '$smallSpacing',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
})
