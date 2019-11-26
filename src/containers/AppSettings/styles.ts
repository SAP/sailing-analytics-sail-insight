import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    flexGrow: 1,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  item: {
    backgroundColor: 'white',
    padding: '$tinySpacing',
    marginBottom: 8,
  },
  item2: {
    backgroundColor: 'white',
    padding: '$tinySpacing',
    marginBottom: 0,
  },
  firstButton: {
    marginTop: '$mediumSpacing',
  },
  lastButton: {
    marginBottom: '$smallSpacing',
  },
  boldText: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-Heavy',
  },
  text: {
    marginTop: '$microSpacing',
    fontSize: '$regularLargeFontSize',
  },
  button: {
    padding: 12,
    backgroundColor: 'transparent', // '#FAFAFA',
    margin: 10,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 5,
  },
  buttonContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontFamily: 'SFCompactText-Bold',
  },
})
