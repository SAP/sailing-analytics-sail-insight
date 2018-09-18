import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: {
    backgroundColor: '$primaryBackgroundColor',
    marginBottom: '$containerFixedMargin',
    padding: '$containerFixedMargin',
  },
  basicInfoContainer: {
    flexGrow: 1,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textMargins: {
    marginTop: '$textFixedMargin',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  moreContainer: {
    marginTop: '$containerFixedMargin',
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
    marginRight: '$containerFixedMargin',
  },
})
