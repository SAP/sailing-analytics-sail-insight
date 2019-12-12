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
    backgroundColor: '$primaryBackgroundColor',
    paddingTop: '$baseSpacing',
    width: '100%',
    height: '100%',
  },
  createButton: {
    marginTop: 42,
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
})
