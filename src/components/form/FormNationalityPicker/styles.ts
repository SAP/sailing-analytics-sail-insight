import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  container: {
    backgroundColor: '$secondaryBackgroundColor',
    borderRadius: '$baseBorderRadius',
    flexDirection: 'row',
    paddingLeft: '$smallSpacing',
    paddingRight: '$smallSpacing',
  },
  containerNoTitle: {
    paddingTop: '$tinySpacing',
    paddingBottom: 4,
    fontSize: '$regularLargeFontSize',
  },
  containerWithTitle: {
    paddingTop: 20,
    paddingBottom: 4,
  },
  inputContainer: {
    flex: 1,
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
    paddingRight: 4,
  },
  title: {
    color: 'white',
    fontSize: '$regularFontSize',
    position: 'absolute',
    top: 0,
    left: 0, // '$smallSpacing',
    alignSelf: 'center',
    paddingTop: 3,
  },
  icon: {
    top: 0,
  },
  inputIOS: {
    fontSize: '$largeFontSize',
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    color: '$primaryTextColor',
  },
  inputAndroid: {
    alignSelf: 'stretch',
    paddingBottom: 1,
    paddingVertical: 0, // remove Android default padding
    height: 29,
    backgroundColor: 'transparent',
  },
  underline: {
    borderTopWidth: 0,
    borderTopColor: 'transparent',
  },
})
