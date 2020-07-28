
import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  $tabFontFamily: '$defaultFontFamily',
  bottomTabBar: {
    backgroundColor: '#123748',
    paddingBottom: 0,
    height: 50,
  },
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
