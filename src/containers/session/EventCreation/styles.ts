import EStyleSheets from 'react-native-extended-stylesheet'
import { white, withDefaultBoldFont, withDefaultFont, withTitleSize, withSecondaryHeavyFont } from 'styles/compositions/text'
import { Platform } from 'react-native'

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
  ...(Platform.OS === 'ios' && { paddingTop: 10, paddingBottom: 10 })
}

export default EStyleSheets.create({
  container: {
    backgroundColor: '$primaryBackgroundColor',
    paddingTop: '$baseSpacing',
    width: '100%',
    height: '100%',
  },
  content: {
    paddingBottom: 110,
    backgroundColor: '$LightBlue',
  },
  errorsContainer: {
    marginLeft: 30,
    marginRight: 30,
    padding: 10,
    backgroundColor: '$declineColor',
    borderRadius: '$smallBorderRadius'
  },
  errorText: {
    color: 'white'
  },
  createButton: {
    marginTop: 42,
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
    ...withSecondaryHeavyFont,
    letterSpacing: 1.5,
  },
})
