import { StyleSheet } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'


export const DEFAULT_BAR_HEIGHT = 30

export default EStyleSheet.create({
  $defaultBarHeight: DEFAULT_BAR_HEIGHT,
  container: {
    backgroundColor: '$secondaryBackgroundColor',
    borderRadius: '$baseBorderRadius',
    flexDirection: 'row',
    paddingHorizontal: '$smallSpacing',
  },
  containerNoTitle: {
    paddingTop: '$smallSpacing',
    paddingBottom: '$smallSpacing',
  },
  containerWithTitle: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    alignSelf: 'stretch',
    paddingLeft: StyleSheet.hairlineWidth,
    paddingRight: 5,
    paddingBottom: 1,
    color: '$primaryTextColor',
    fontSize: '$largeFontSize',
    paddingVertical: 0, // remove Android default padding
  },
  title: {
    color: '$secondaryTextColor',
    fontSize: '$regularFontSize',
    position: 'absolute',
    top: 0,
    left: 0,
    alignSelf: 'center',
    paddingTop: 3,
  },
  securedToggleBtn: {
    alignSelf: 'stretch',
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  securedToggleBtnText: {
    fontSize: '$regularFontSize',
  },
  visibilityIcon: {
    width: '$defaultIconSize',
    height: '$defaultIconSize',
    resizeMode: 'contain',
    tintColor: '$secondaryTextColor',
  },
})
