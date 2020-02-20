import EStyleSheets from 'react-native-extended-stylesheet'
import { withSecondaryMediumFont, withSecondaryHeavyFont } from 'styles/compositions/text'

export default EStyleSheets.create({
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '$primaryBackgroundColor',
    paddingTop: 40,
  },
  list: {
    backgroundColor: 'transparent',
    paddingBottom: 50,
  },
  cardsContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 0,
    backgroundColor: 'white',
  },
  createButton: {
    backgroundColor: '$primaryBackgroundColor',
    padding: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    margin: 10,
    marginBottom: 0,
  },
  createButtonIcon: {
    width: 54,
    height: 54,
  },
  createButtonText: {
    color: 'white',
    fontSize: 20,
    ...withSecondaryMediumFont,
  },
  bottomButton: {
    width: '100%',
    height: 'auto',
    backgroundColor: '$primaryBackgroundColor',
    bottom: 0,
  },
  qrButton: {
    marginTop: 15,
    marginBottom: 15,
  },
  qrButtonText: {
    color: 'white',
    fontSize: 24,
    ...withSecondaryHeavyFont,
  },
})
