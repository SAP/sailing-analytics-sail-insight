import EStyleSheets from 'react-native-extended-stylesheet'
import { $DarkBlue } from 'styles/colors'
import { withSecondaryHeavyFont, withSecondaryMediumFont } from 'styles/compositions/text'

export default (forTracking: boolean) => EStyleSheets.create({
  container: {
    paddingTop: 40,
    width: '100%',
    height: '100%',
    backgroundColor: '$primaryBackgroundColor'
  },
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '$primaryBackgroundColor',
    paddingTop: forTracking ? 40 : 0,
  },
  headLine: {
    color: 'white',
    fontSize: 24,
    ...withSecondaryHeavyFont,
    margin: 10,
  },
  list: {
    backgroundColor: 'transparent',
    paddingBottom: forTracking ? 150 + 40 : 150,
  },
  cardsContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 0,
    ...(forTracking ? {
      backgroundColor: '$primaryBackgroundColor',
      borderWidth: 2,
      borderColor: '#F0AB00',
    } : {
      backgroundColor: 'white',
    })
  },
  createButton: {
    backgroundColor: '$primaryBackgroundColor',
    padding: forTracking ? 8 : 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    margin: 10,
    marginBottom: 0,
  },
  createButtonIcon: {
    width: 54,
    height: 54,
    ...(forTracking ? {
      marginTop: 4,
      marginRight: 8,
    } : {})
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
    ...(forTracking ? {
      backgroundColor: 'white'
    } : {})
  },
  qrButtonText: {
    color: forTracking ? $DarkBlue : 'white',
    fontSize: 24,
    ...withSecondaryHeavyFont,
  },
})
