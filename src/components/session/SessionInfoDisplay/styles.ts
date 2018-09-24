import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  detailContainer: {
    paddingHorizontal: '$containerFixedMargin',
    paddingVertical: '$containerFixedSmallMargin',
    backgroundColor: 'white',
    marginBottom: '$containerFixedSmallMargin',
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
  textMargins: {
    marginTop: '$textFixedMargin',
  },
  dateText: {
    fontSize: 12,
  },
  tracksText: {
    marginLeft: 6,
    marginRight: 3,
  },
  tracksCountText: {
    fontSize: 12,
  },
  trackingButton: {
    width: 49,
    height: 49,
  },
  settingsButton: {
    width: 49,
    height: 49,
    padding: 12.5,
  },
  trackingImage: {
    tintColor: '$importantHighlightColor',
  },
  coverImage: {
    height: 176,
    width: '100%',
    resizeMode: 'cover',
  },
  basicInfoContainer: {
    flexGrow: 1,
  },
})
