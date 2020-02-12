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
    paddingBottom: 110,
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
    position: 'absolute',
    width: '100%',
    height: 'auto',
    backgroundColor: 'transparent',
    bottom: 0,
  },
  qrButton: {
    marginBottom: 30,
  },
  qrButtonText: {
    color: 'white',
    fontSize: 24,
    ...withSecondaryHeavyFont,
  },
})
