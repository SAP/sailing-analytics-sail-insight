import { Dimensions } from 'react-native';
import EStyleSheets from 'react-native-extended-stylesheet'
import { $smallSpacing, $tinySpacing } from 'styles/dimensions';

export default EStyleSheets.create({
  imageContainer: {
    marginBottom: '$tinySpacing',
  },
  detailContainer: {
    paddingVertical: '$tinySpacing',
    marginTop: 16,
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
  itemText: {
    width: Dimensions.get('window').width - 44 - 4 * $smallSpacing,
  },
  dateText: {
    fontSize: '$regularFontSize',
  },
  tracksText: {
    marginLeft: '$microSpacing+2',
    marginRight: '$microSpacing-1',
    color: '#333333',
  },
  tracksCountText: {
    fontSize: '$regularFontSize',
  },
  trackingButton: {
    width: 49,
    height: 49,
    marginRight: $tinySpacing,
  },
  settingsButton: {
    width: 49,
    height: 49,
    padding: 12.5,
  },
  trackingImage: {
    tintColor: '$Orange', // '$importantHighlightColor',
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
    marginBottom: '$microSpacing',
  },
  fullInfoItem: {
    maxWidth: '100%',
  },
  image: {
    width: 44,
    resizeMode: 'cover',
    height: 44,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
    marginBottom: '$smallSpacing',
    marginTop: 20,
    borderRadius: 11,
  },
  arrowContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  spinnerStyle: {
    paddingRight: 5,
  }
})
