import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  list: {
    backgroundColor: '$primaryBackgroundColor',
  },
  textStyle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    fontFamily: 'SFProDisplay-Heavy',
  },
  addButton: {
    height: 56,
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 15,
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
    borderRadius: '$baseBorderRadius',
    backgroundColor: '$primaryButtonColor',
  },
})
