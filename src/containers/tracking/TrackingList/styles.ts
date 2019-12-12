import EStyleSheets from 'react-native-extended-stylesheet'
import { $DarkBlue } from 'styles/colors'

export default EStyleSheets.create({
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '$primaryBackgroundColor',
    paddingTop: 80,
  },
  headLine: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'SFProDisplay-Heavy',
    margin: 10,
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
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F0AB00',
  },
  createButton: {
    backgroundColor: '$primaryBackgroundColor',
    padding: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    margin: 10,
    marginBottom: 0,
  },
  createButtonIcon: {
    width: 54,
    height: 54,
    marginTop: 4,
    marginRight: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Medium',
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
    backgroundColor: 'white',
  },
  qrButtonText: {
    color: $DarkBlue,
    fontSize: 24,
    fontFamily: 'SFProDisplay-Heavy',
  },
})
