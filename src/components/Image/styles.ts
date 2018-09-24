import EStyleSheet from 'react-native-extended-stylesheet'


export default EStyleSheet.create({
  indicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 2,
    height: 14,
    width: 14,
  },
  error: {
    width: 14,
    height: 14,
    tintColor: '$secondaryTextColor',
    resizeMode: 'contain',
  },
})
