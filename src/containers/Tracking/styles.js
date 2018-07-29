import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailButtonContainer: {
    flexDirection: 'row',
  },
  detailButton: {
    flex: 1,
    margin: '$containerFixedSmallMargin',
  },
})
