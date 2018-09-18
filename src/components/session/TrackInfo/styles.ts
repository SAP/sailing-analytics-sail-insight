import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  $separatorVerticalMargin: 21,
  line: {
    flexDirection: 'row',
  },
  item: {
    flex: 0.5,
  },
  propertyValue: {
    fontSize: 20,
    fontWeight: '300',
  },
  propertyUnit: {
    fontSize: 12,
    fontWeight: '300',
  },
  lineMargin: {
    marginBottom: 37,
  },
  separatorMargin: {
    marginVertical: '$separatorVerticalMargin',
  },
  topSeparator: {
    marginBottom: '$separatorVerticalMargin',
  },
})
