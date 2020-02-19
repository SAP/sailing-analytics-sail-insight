import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  inputIOS: {
    fontSize: '$largeFontSize',
    paddingVertical: '$smallSpacing',
    paddingHorizontal: '$smallSpacing',
    borderTopRightRadius: '$baseBorderRadius',
    borderBottomRightRadius: '$baseBorderRadius',
    backgroundColor: 'transparent',
    color: 'transparent',
    width: 30,
  },
  inputAndroid: {
    width: 40,
    color: 'transparent',
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
  containerIcon: {
    top: '35%',
    marginRight: 5.25,
  },
  inputPlaceholder: {
    color: 'transparent',
  },
  containerPicker: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingRight: '$smallSpacing'
  },
})
