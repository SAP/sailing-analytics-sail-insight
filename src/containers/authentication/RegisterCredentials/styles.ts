import EStyleSheets from 'react-native-extended-stylesheet'
import { withSecondaryHeavyFont, withSecondaryMediumFont } from 'styles/compositions/text'


export default EStyleSheets.create({
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '$DarkBlue',
  },
  textContainer: {
    flex: 1,
    marginTop: 85,
    marginBottom: 15,
  },
  claim1: {
    color: '#F0AB00',
    fontSize: 17,
    ...withSecondaryHeavyFont,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  claim2: {
    color: '#FFFFFF',
    fontSize: 17,
    ...withSecondaryHeavyFont,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  inputContainer: {
    backgroundColor: 'transparent',
  },
  inputStyle: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  inputField: {
    flex: 1,
    paddingBottom: 37,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  lowerTextInput: {
    marginTop: '$smallSpacing',
  },
  taskTextSize: {
    fontSize: '$regularLargeFontSize',
  },
  taskText: {
    fontWeight: '300',
    marginTop: '$smallSpacing',
    marginBottom: '$smallSpacing',
  },
  eulaField: {
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  bottomButtonField: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 150,
    marginTop: 'auto',
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
  },
  registrationButton: {
    backgroundColor: '$primaryButtonColor',
    marginTop: 20,
    alignSelf: 'stretch',
    height: 56,
    borderRadius: '$baseBorderRadius',
  },
  registrationButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    ...withSecondaryHeavyFont,
  },
  loginText: {
    marginTop: '$smallSpacing',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#FFFFFF',
    fontSize: 14,
    ...withSecondaryMediumFont,
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
})
