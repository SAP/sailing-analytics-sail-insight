import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: {
    paddingLeft: '$containerFixedMargin',
    paddingRight: '$containerFixedMargin',
    paddingTop: '$containerFixedSmallMargin',
    paddingBottom: '$containerFixedSmallMargin',
    backgroundColor: 'white',
    marginBottom: '$containerFixedSmallMargin',
  },
  iconText: {
    flexDirection: 'row',
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
  },
  tracksText: {
    fontSize: 12,
    fontWeight: '300',
    marginLeft: 6,
    marginRight: 3,
  },
  tracksCountText: {
    fontSize: 12,
  },
})
