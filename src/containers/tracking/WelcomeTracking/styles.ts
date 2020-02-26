import EStyleSheets from 'react-native-extended-stylesheet'
import { withSecondaryHeavyFont } from 'styles/compositions/text'

export default EStyleSheets.create({
  $sideMargin: 24,
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexGrow: 2,
    display: 'flex',
    marginTop: 80,
    marginLeft: 20,
    paddingTop: 60,
    alignItems: 'flex-start',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    ...withSecondaryHeavyFont,
    textTransform: 'uppercase',
    marginBottom: '$largeSpacing',
  },
  bottomContainer: {
    flexGrow: 0,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30,
  },
  bigButton: {
    marginBottom: '$smallSpacing',
  },
  bigButtonWhite: {
    alignSelf: 'stretch',
    height: 56,
    borderRadius: '$baseBorderRadius',
    marginBottom: '$smallSpacing',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
  },
  bigButtonText: {
    color: 'white',
    fontSize: 24,
    ...withSecondaryHeavyFont,
  },
  bigButtonTextInverse: {
    color: '#1D3F4E',
    fontSize: 24,
    ...withSecondaryHeavyFont,
  },
})
