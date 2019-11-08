import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#12374866',
  },
  textContainer: {
    flex: 1,
    marginTop: 46,
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
  email: {
    marginTop: 16,
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  message: {
    marginTop: 16,
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Heavy',
  },
  bottomButtonField: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 150,
    marginTop: 'auto',
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
  },
  resetButton: {
    backgroundColor: '#FF6C52',
    marginTop: 20,
    alignSelf: 'stretch',
    height: 56,
    borderRadius: '$baseBorderRadius',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'SFProDisplay-Heavy',
  },
})
