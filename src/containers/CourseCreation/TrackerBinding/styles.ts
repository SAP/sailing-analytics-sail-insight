import EStyleSheets from 'react-native-extended-stylesheet'
import { white, withTitleSize, withDefaultFont } from 'styles/compositions/text'

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
    fontFamily: 'SFProDisplay-Heavy',
    letterSpacing: 1.5,
  },
})
