import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  topInput: {
    marginTop: '$smallSpacing',
    marginBottom: '$tinySpacing',
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  inputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  inputField: {
    paddingLeft: '$smallSpacing',
    paddingRight: '$smallSpacing',
  },
  buttonContainer: {
    backgroundColor: '#0E2A37',
    height: 70,
    marginBottom: '$tinySpacing',
    padding: '$smallSpacing',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Medium',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Heavy',
  },
  bottomButtonField: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 50,
    marginTop: 'auto',
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
  },
  saveButton: {
    backgroundColor: '#FF6C52',
    marginTop: 20,
    alignSelf: 'stretch',
    height: 56,
    borderRadius: '$baseBorderRadius',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'SFProDisplay-Heavy',
  },
  logoutButton: {
    marginTop: '$smallSpacing',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#FF6C52',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
})
