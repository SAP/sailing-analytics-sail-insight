import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderContainer: {
    backgroundColor: '$secondaryBackgroundColor',
  },
  detailButtonContainer: {
    flexDirection: 'row',
  },
  detailButton: {
    flex: 1,
    margin: '$tinySpacing',
  },
  header: {
    backgroundColor: '$primaryBackgroundColor',
  },
  headerWithTracks: {
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: '$largeFontSize',
    fontWeight: '500',
    marginTop: '$smallSpacing-1',
    marginBottom: '$smallSpacing-1',
    marginLeft: '$smallSpacing-2',
    color: '$secondaryTextColor',
  },
  sidePadding: {
    paddingHorizontal: '$smallSpacing',
  },
})
