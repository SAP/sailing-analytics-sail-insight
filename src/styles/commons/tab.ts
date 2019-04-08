
import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  $tabFontFamily: '$defaultFontFamily',
  bottomTabItemText: {
    fontFamily: '$tabFontFamily',
    fontSize: '$regularFontSize',
  },
  topTabItemText: {
    fontFamily: '$tabFontFamily',
    fontSize: '$regularLargeFontSize',
    fontWeight: '300',
  },
  tabItemIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
})
