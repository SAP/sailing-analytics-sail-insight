import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  container: {
    backgroundColor: '$secondaryBackgroundColor',
    borderRadius: '$baseBorderRadius',
    flexDirection: 'row',
  },
  containerNoTitle: {
    paddingTop: '$smallSpacing',
    paddingBottom: '$smallSpacing',
  },
  containerWithTitle: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  inputContainer: {
    flex: 1,
  },
  title: {
    color: '$secondaryTextColor',
    fontSize: '$regularFontSize',
    position: 'absolute',
    top: 0,
    left: '$smallSpacing',
    alignSelf: 'center',
    paddingTop: 3,
  },
  icon: {
    top: 0,
  },
  inputIOS: {
    fontSize: '$largeFontSize',
    paddingHorizontal: '$smallSpacing',
    backgroundColor: '$secondaryBackgroundColor',
    color: '$primaryTextColor',

  },
  inputAndroid: {
  },

})
