import EStyleSheet from 'react-native-extended-stylesheet'


export default EStyleSheet.create({
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerStyle: {
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  disabled: {
    opacity: 0.3,
    backgroundColor: '$secondaryTextColor',
  },
})
