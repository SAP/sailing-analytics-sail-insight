import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  detailContainer: {
    paddingHorizontal: '$smallSpacing',
    paddingVertical: '$tinySpacing',
    backgroundColor: 'white',
    marginBottom: '$tinySpacing',
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
    marginTop: '$microSpacing',
  },
  dateText: {
    fontSize: '$regularFontSize',
  },
  tracksText: {
    marginLeft: '$microSpacing+2',
    marginRight: '$microSpacing-1',
  },
  tracksCountText: {
    fontSize: '$regularFontSize',
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
  infoItem: {
    maxWidth: '50%',
    marginRight: '$tinySpacing',
  },
  fullInfoItem: {
    maxWidth: '100%',
  },
})
