import EStyleSheets from 'react-native-extended-stylesheet'
import { withSecondaryHeavyFont } from 'styles/compositions/text'

export default EStyleSheets.create({
  list: {
    backgroundColor: '$primaryBackgroundColor',
  },
  textStyle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    ...withSecondaryHeavyFont,
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
