import EStyleSheets from 'react-native-extended-stylesheet'
import { withSecondaryHeavyFont } from 'styles/compositions/text'

export default EStyleSheets.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    height: '100%',
  },
  backendImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  sap_logo: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 54,
    height: 38,
  },
  headline: {
    color: 'white',
    fontSize: 30,
    ...withSecondaryHeavyFont,
    position: 'absolute',
    top: 80,
    left: 16,
  },
})
