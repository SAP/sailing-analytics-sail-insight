import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'

const discardSelectorCircleDiameter = 50

export default EStyleSheets.create({
  sectionHeaderStyle,
  container: {
    backgroundColor: '$LightBlue',
    paddingHorizontal: '$smallSpacing',
  },
  textHeader: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '$regularFontSize',
  },
  textDescription: {
    color: 'white',
    fontSize: '$regularFontSize',
  },
  setDiscardButton: {
    height: 40,
    borderRadius: '$smallBorderRadius',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '$largeSpacing',
    borderWidth: 1,
    borderColor: 'white',
  },
  setDiscardText: {
    color: 'white',
    fontSize: '$largeFontSize',
    letterSpacing: 1,
  },
  discardSelectorItemContainer: {
    height: discardSelectorCircleDiameter,
    width: discardSelectorCircleDiameter,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: discardSelectorCircleDiameter / 2,
  },
  discardSelectorItemText: {
    fontSize: '$titleFontSize',
    fontWeight: 'bold',
    color: 'black',
  },
  discardSelectorPlusContainer: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '$LightBlue'
  },
  discardSelectorPlusText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'normal',
  },
})
