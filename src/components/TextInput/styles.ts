import { StyleSheet } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'


export const DEFAULT_BAR_HEIGHT = 30

export default EStyleSheet.create({
  $defaultBarHeight: DEFAULT_BAR_HEIGHT,
  $containerPadding: 16,
  container: {
    backgroundColor: '$secondaryBackgroundColor',
    borderRadius: 6,
    flexDirection: 'row',
    paddingLeft: '$containerPadding',
    paddingRight: '$containerPadding',
  },
  containerNoTitle: {
    paddingTop: '$containerPadding',
    paddingBottom: '$containerPadding',
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
    fontSize: 16,
    paddingVertical: 0, // remove Android default padding
  },
  title: {
    color: '$secondaryTextColor',
    fontSize: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    alignSelf: 'center',
    paddingTop: 3,
  },
  assistiveText: {
    marginLeft: '$containerPadding',
    marginRight: '$containerPadding',
    marginTop: 2,
    color: '$secondaryTextColor',
  },
  securedToggleBtn: {
    alignSelf: 'stretch',
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  securedToggleBtnText: {
    fontSize: 12,
  },
  visibilityIcon: {
    width: '$defaultIconSize',
    height: '$defaultIconSize',
    resizeMode: 'contain',
    tintColor: '$secondaryTextColor',
  },
})
