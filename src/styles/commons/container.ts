import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '$primaryBackgroundColor',
  },
  list: {
    flex: 1,
    backgroundColor: '$secondaryBackgroundColor',
  },
  content: {
    flexGrow: 1,
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stretchContent: {
    alignSelf: 'stretch',
    flexGrow: 1,
  },
  logo: {
    height: 30,
    width: 60,
    resizeMode: 'contain',
    marginLeft: '$smallSpacing',
  },
  smallHorizontalMargin: {
    marginLeft: '$baseRelativeSpacing',
    marginRight: '$baseRelativeSpacing',
  },
  mediumHorizontalMargin: {
    marginLeft: '$mediumRelativeSpacing',
    marginRight: '$mediumRelativeSpacing',
  },
  largeHorizontalMargin: {
    marginLeft: '$largeRelativeSpacing',
    marginRight: '$largeRelativeSpacing',
  },
  largeHorizontalPadding: {
    paddingLeft: '$largeRelativeSpacing',
    paddingRight: '$largeRelativeSpacing',
  },
  registerBottomContainer: {
    paddingTop: '$smallSpacing',
    paddingBottom: 37,
  },
})
