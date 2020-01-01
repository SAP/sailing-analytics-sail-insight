import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'

export default EStyleSheets.create({
  sectionHeaderStyle,
  container: {
    backgroundColor: '$LightBlue',
    paddingHorizontal: '$smallSpacing',
  },
  textHeader: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '$regularLargeFontSize',
  },
  textDescription: {
    color: 'white',
    fontSize: '$regularFontSize',
    marginBottom: '$tinySpacing',
  },
  setDiscardButton: {
    height: 40,
    borderRadius: '$smallBorderRadius',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '$largeSpacing',
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 20,
  },
  raceNumberContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 0,
  },
  setDiscardText: {
    color: 'white',
    fontSize: '$largeFontSize',
    letterSpacing: 1,
  }
})
