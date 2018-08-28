import EStyleSheet from 'react-native-extended-stylesheet'


export default EStyleSheet.create({
  $iconSize: 24,
  baseItem: {
    alignItems: 'center',
  },
  baseIcon: {
    height: '$iconSize',
    width: '$iconSize',
    resizeMode: 'contain',
  },
  baseText: {
    fontSize: 12,
  },
  separator: {
    height: 4,
    width: 4,
  },
})
