import EStyleSheets from 'react-native-extended-stylesheet'
import { withDefaultBoldFont, withDefaultFont, white, withTitleSize } from 'styles/compositions/text'

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
  fontSize: '$largeFontSize'
}

export default EStyleSheets.create({
  container: {
    backgroundColor: '$LightBlue',
  },
  createButton: {
    backgroundColor: '$Orange',
    marginHorizontal: '$largeSpacing',
    borderRadius: '$smallBorderRadius',
    justifyContent: 'center',
    alignItems: 'center',
    height: '$defaultImageButtonSize',
  },
  createButtonText: {
    ...white,
    ...withTitleSize,
    letterSpacing: 1.5,
  },
  backNavigationContainer: {
    backgroundColor: '$DarkBlue',
    paddingTop: '$tinySpacing',
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
