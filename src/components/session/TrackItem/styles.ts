import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: {
    backgroundColor: '$primaryBackgroundColor',
    marginBottom: '$smallSpacing',
    padding: '$smallSpacing',
  },
  basicInfoContainer: {
    flexGrow: 1,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textMargins: {
    marginTop: '$microSpacing',
  },
  moreContainer: {
    marginTop: '$smallSpacing',
  },
  iconButton: {
    width: 49,
    height: 49,
    padding: 12.5,
  },
  settingsButton: {
    tintColor: '$secondaryTextColor',
  },
  sessionInfoContainer: {
    marginVertical: 20,
  },
  dateText: {
    marginRight: '$smallSpacing',
  },
})
