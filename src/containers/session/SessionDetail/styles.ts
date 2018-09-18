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
    margin: '$containerFixedSmallMargin',
  },
  header: {
    backgroundColor: '$primaryBackgroundColor',
  },
  headerWithTracks: {
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 14,
    color: '$secondaryTextColor',
  },
  sidePadding: {
    paddingHorizontal: '$containerFixedMargin',
  },
})
