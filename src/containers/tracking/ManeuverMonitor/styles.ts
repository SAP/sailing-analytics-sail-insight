import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  container: {
    marginTop: 25,
  },
  informationItem: {
    padding: '$tinySpacing',
  },
  propertyRow: {
    marginTop: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 23,
  },
  property: {
    marginTop: 26,
  },
  dynamicPropertyContainer: {
    flex: 0.33,
  },
  sectionTitle: {
    fontSize: '$regularFontSize',
    fontWeight: '500',
    letterSpacing: 2.04,
    alignSelf: 'center',
  },
  separator: {
    width: '100%',
    height: 1,
    marginTop: 4,
    backgroundColor: '$secondaryBackgroundColor',
  },
  lowerValueContainer: {
    marginTop: 20,
  },
  lowerTitle: {
    fontSize: '$regularFontSize',
  },
  lowerValue: {
    fontSize: '$largeFontSize',
  },
  lowerUnit: {
    fontSize: '$microFontSize',
  },
})
