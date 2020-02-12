import EStyleSheets from 'react-native-extended-stylesheet'
import { withSecondaryHeavyFont, withSecondaryMediumFont } from 'styles/compositions/text'

export default EStyleSheets.create({
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#12374866',
  },
  textContainer: {
    flex: 1,
    marginTop: 90,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  claim: {
    color: '#FFFFFF',
    fontSize: 20,
    ...withSecondaryHeavyFont,
    marginTop: 30,
  },
  subClaim: {
    color: '#FFFFFF',
    fontSize: 16,
    ...withSecondaryMediumFont,
    marginTop: 16,
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
