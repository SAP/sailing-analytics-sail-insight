import EStyleSheets from 'react-native-extended-stylesheet'
import { white, withTitleSize, withDefaultFont, withSecondaryHeavyFont } from 'styles/compositions/text'
import { Dimensions } from 'react-native'

export default EStyleSheets.create({
  container: {
    backgroundColor: '$primaryBackgroundColor',
    paddingTop: '$baseSpacing',
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  scanText: {
    ...white,
    ...withDefaultFont,
    fontSize: 20,
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    textAlign: 'center'
  },
  useThisDeviceButton: {
    marginTop: 42,
    marginBottom: 50,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '$Orange',
    marginHorizontal: '$largeSpacing',
    borderRadius: '$smallBorderRadius',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  useThisDeviceButtonText: {
    ...white,
    ...withTitleSize,
    ...withSecondaryHeavyFont,
    letterSpacing: 1.5,
  },
  qrCodeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  invalidMarkOverlay: {
    position: 'absolute',
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 70 / 100,
    padding: 20
  },
  invalidMarkText: {
    ...withDefaultFont,
    textAlign: 'center',
    fontSize: 20
  }
})
