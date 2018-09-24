
import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  containerButton: {
    marginBottom: '10%',
  },
  sliderCaptionContainer: {
    marginTop: '$smallSpacing+2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  title: {
    fontSize: '$regularFontSize',
    fontWeight: '500',
    letterSpacing: -0.1,
    color: '$secondaryTextColor',
  },
  metaDisplay: {
    marginTop: 10,
    backgroundColor: '$secondaryBackgroundColor',
    paddingLeft: '$tinySpacing',
    paddingRight: '$tinySpacing',
    paddingTop: '$microSpacing',
    paddingBottom: '$microSpacing',
    fontSize: '$regularLargeFontSize',
    fontWeight: '500',
    letterSpacing: 0.25,
    borderRadius: 4,
    overflow: 'hidden',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: '$tinySpacing',
  },
  controlsContainer: {
    justifyContent: 'space-around',
  },
  speedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speedButton: {
    width: 45,
    height: 45,
    padding: 10.5,
    borderRadius: 22.5,
    resizeMode: 'contain',
    tintColor: '$secondaryButtonColor',
    borderColor: '$secondaryButtonColor',
    borderWidth: 2,
  },
})
