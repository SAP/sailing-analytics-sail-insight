import { Platform } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

const ANDROID_BOTTOM_TAB_BAR_CONTENT_HEIGHT = 65

// iOS uses react-navigation's default tab bar height and padding, which already
// account for the home indicator. On Android the tab bar content is taller than
// the default, so height and padding are set explicitly; both must include the
// bottom safe-area inset so that the tab bar is not covered by the system
// navigation bar when the app is drawn edge-to-edge (targetSdk >= 35).
export const bottomTabBarInsetStyle = (bottomInset: number) =>
  Platform.OS !== 'ios'
    ? { height: ANDROID_BOTTOM_TAB_BAR_CONTENT_HEIGHT + bottomInset, paddingBottom: bottomInset }
    : undefined

export default EStyleSheet.create({
  $tabFontFamily: '$defaultFontFamily',
  bottomTabBar: {
    backgroundColor: '#123748',
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
