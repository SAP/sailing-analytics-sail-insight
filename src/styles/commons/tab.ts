
import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  $tabFontFamily: '$defaultFontFamily',
  bottomTabItemText: {
    fontFamily: '$tabFontFamily',
    fontSize: '$regularFontSize',
    marginTop: 4,
  },
  topTabItemText: {
    fontFamily: '$tabFontFamily',
    fontSize: '$regularFontSize',
    fontWeight: '300',
  },
  tabItemIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
})
