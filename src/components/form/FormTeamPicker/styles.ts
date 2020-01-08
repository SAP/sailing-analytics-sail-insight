import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  inputIOS: {
    fontSize: '$largeFontSize',
    paddingVertical: '$smallSpacing',
    paddingHorizontal: '$smallSpacing',
    borderTopRightRadius: '$baseBorderRadius',
    borderBottomRightRadius: '$baseBorderRadius',
    backgroundColor: 'transparent',
    color: '$primaryTextColor',
    width: 30,
  },
  inputAndroid: {
    width: 40,
  },
  underline: {
    borderTopWidth: 0,
    borderTopColor: 'transparent',
  },
  container: {
    backgroundColor: 'transparent',
    borderRadius: '$baseBorderRadius',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
  },
})
