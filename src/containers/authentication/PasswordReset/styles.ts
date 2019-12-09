import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#12374866',
  },
  textContainer: {
    flex: 1,
    marginTop: 46,
    marginLeft: '$tinySpacing',
    marginRight: '$tinySpacing',
  },
  claim: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Heavy',
  },
  inputContainer: {
    backgroundColor: 'transparent',
  },
  inputField: {
    flex: 1,
    paddingLeft: '$smallSpacing',
    paddingRight: '$smallSpacing',
    paddingBottom: 37,
  },
  inputStyle: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  email: {
    marginTop: 16,
  },
  message: {
    marginTop: 16,
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Heavy',
  },
  redBalloon: {
    marginTop: '$smallSpacing',
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
    marginBottom: 'auto',
    backgroundColor: '#FD3737',
    borderRadius: '$baseBorderRadius',
    position: 'relative',
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  redBalloonText: {
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: '$tinySpacing',
    marginBottom: '$tinySpacing',
  },
  attention: {
    position: 'absolute',
    left: 20,
    height: '100%',
    width: 16,
  },
  bottomButtonField: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 150,
    marginTop: 'auto',
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
  },
  resetButton: {
    backgroundColor: '#FF6C52',
    marginTop: 20,
    alignSelf: 'stretch',
    borderRadius: '$baseBorderRadius',
    alignContent: 'center',
    paddingTop: '$smallSpacing',
    paddingBottom: '$smallSpacing',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'SFProDisplay-Heavy',
  },
})
