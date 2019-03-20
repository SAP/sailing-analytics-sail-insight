import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  container: {
    backgroundColor: '$secondaryBackgroundColor',
    borderRadius: '$baseBorderRadius',
    flexDirection: 'row',
    paddingHorizontal: '$tinySpacing',
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
  input: {
    alignSelf: 'stretch',
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 1,
    color: '$primaryTextColor',
    fontSize: '$largeFontSize',
    paddingVertical: 0, // remove Android default padding
  },
  title: {
    color: '$secondaryTextColor',
    fontSize: '$regularFontSize',
    position: 'absolute',
    top: 0,
    left: '$tinySpacing',
    alignSelf: 'center',
    paddingTop: 3,
  },
})
