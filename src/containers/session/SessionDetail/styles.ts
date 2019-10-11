import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    // padding: 10,
    backgroundColor: '$primaryBackgroundColor',
  },
  card: {
    padding: 12,
    paddingRight: 5,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    margin: 10,
    marginTop: 0,
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
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
  betaButton: {
    // styles are a bit hacky, but this button will be removed soon
    backgroundColor: '$primaryButtonColor',
    alignSelf: 'flex-end',
    width: 60,
    height: 24,
    borderRadius: '$baseBorderRadius',
    marginRight: 90,
    marginTop: -43,
    marginBottom: 8,
  },
  betaButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '$titleFontSize-2',
    letterSpacing: -0.5,
  },
})
