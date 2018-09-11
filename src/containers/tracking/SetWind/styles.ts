
import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  containerButton: {
    marginBottom: '10%',
  },
  sliderCaptionContainer: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
    color: '$secondaryTextColor',
  },
  metaDisplay: {
    marginTop: 10,
    backgroundColor: '$secondaryBackgroundColor',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 13.75,
    fontWeight: '500',
    letterSpacing: 0.25,
    borderRadius: 4,
    overflow: 'hidden',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 8,
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
    borderColor: 'black',
    borderWidth: 2,
  },
})
