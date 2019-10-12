import EStyleSheets from 'react-native-extended-stylesheet'
import { white, withDefaultBoldFont, withDefaultFont, withTitleSize } from 'styles/compositions/text'

export const sectionHeaderStyle = {
  ...withDefaultBoldFont,
  ...white,
  ...withTitleSize,
  letterSpacing: 0.5,
  marginBottom: '$smallSpacing',
}

export const textInput = {
  ...withDefaultFont,
  flex: 1,
  fontSize: '$largeFontSize',
  marginTop: 5,
}

export default EStyleSheets.create({
  container: {
    backgroundColor: '$DarkBlue',
  },
  createButton: {
    marginTop: 50,
    marginBottom: 50,
    backgroundColor: '$Orange',
    marginHorizontal: '$largeSpacing',
    borderRadius: '$smallBorderRadius',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  createButtonText: {
    ...white,
    ...withTitleSize,
    fontFamily: 'SFProDisplay-Heavy',
    letterSpacing: 1.5,
  },
  backNavigationContainer: {
    backgroundColor: '$DarkBlue',
    paddingTop: '$largeSpacing',
    paddingBottom: '$mediumSpacing',
  },
  backNavigationButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backNavigationText: {
    fontSize:  '$largeFontSize',
    color: 'white',
  },
})
