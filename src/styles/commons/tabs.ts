
import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  $tabFontFamily: '$defaultFontFamily',
  bottomTabItemText: {
    fontFamily: '$tabFontFamily',
    fontSize: '$bottomTabItemFontSize',
  },
  topTabItemText: {
    fontFamily: '$tabFontFamily',
    fontSize: '$topTabItemFontSize',
  },
  tabItemIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
})
