import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '$containerFixedMargin',
    paddingRight: '$containerFixedMargin',
    paddingTop: '$containerFixedSmallMargin',
    paddingBottom: '$containerFixedSmallMargin',
    backgroundColor: 'white',
    marginBottom: '$containerFixedSmallMargin',
  },
})
