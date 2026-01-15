import { Platform } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  $tabFontFamily: '$defaultFontFamily',
  bottomTabBar: {
    backgroundColor: '#123748',
    // Don't explicitly set the padding and height for iOS devices
    // because they can have the virutal home button at the bottom
    // which requires the default padding and height values and not the overrides
    ...(Platform.OS !== 'ios' ? {
      paddingBottom: 0,
      height: 65, // TODO :  flexible height based on device
    } : {})
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
