import EStyleSheets from 'react-native-extended-stylesheet'

export const sectionHeaderStyle = {
  fontSize: '$titleFontSize',
  color: 'white',
  letterSpacing: 0.5,
  marginBottom: '$smallSpacing',
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
    color: 'white',
    fontSize: '$titleFontSize',
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
