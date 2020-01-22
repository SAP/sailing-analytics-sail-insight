import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: '$mediumSpacing',
    marginLeft: '$largeRelativeSpacing',
    marginRight: '$largeRelativeSpacing',
    alignSelf: 'stretch',
    flexDirection: 'column',
  },
  claim: {
    alignSelf: 'stretch',
    fontSize: '$titleFontSize',
    fontWeight: 'bold',
    color: 'white',
  },
  inputContainer: {
    backgroundColor: 'transparent',
  },
  textInput: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  emailContainer: {
    paddingTop: '$smallSpacing',
  },
  button: {
    padding: 12,
    backgroundColor: 'transparent', // '#FAFAFA',
    margin: 10,
    marginTop: '$smallSpacing',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontFamily: 'SFCompactText-Bold',
  },
})
