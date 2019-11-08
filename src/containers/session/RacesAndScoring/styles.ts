import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'

const discardSelectorCircleDiameter = 50


const discardSelectorItemContainer = {
  height: discardSelectorCircleDiameter,
  width: discardSelectorCircleDiameter,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  margin: 5,
  borderRadius: discardSelectorCircleDiameter / 2,
}

const discardSelectorPlusContainer = {
  ...discardSelectorItemContainer,
  backgroundColor: '$LightBlue',
  borderWidth: 1,
  borderColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
}

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
  },
  discardContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    overflow: 'scroll',
  },
  discardSelectorItemContainer,
  discardSelectorPlusContainer,
  discardSelectorItemText: {
    fontSize: '$titleFontSize',
    fontWeight: 'bold',
    color: 'black',
  },
  discardSelectorPlusText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'normal',
    lineHeight: 51,
    width: 50,
    height: 50,
    textAlign: 'center',
  },
})
