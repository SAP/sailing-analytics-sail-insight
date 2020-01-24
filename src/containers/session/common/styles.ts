import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'
import { withDefaultBoldFont } from 'styles/compositions/text'

const discardSelectorCircleDiameter = 50


const discardSelectorItemContainer = {
  height: discardSelectorCircleDiameter,
  width: discardSelectorCircleDiameter,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  margin: 5,
  borderRadius: discardSelectorCircleDiameter / 2,
}

const discardSelectorPlusContainer = {
  ...discardSelectorItemContainer,
  backgroundColor: undefined,
  borderWidth: 1,
  borderColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
}

export default EStyleSheets.create({
  button: {
    padding: 12,
    backgroundColor: 'transparent', // '#FAFAFA',
    margin: 10,
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 5,
  },
  buttonContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontFamily: 'SFCompactText-Bold',
  },
  container1: {
    backgroundColor: '$primaryBackgroundColor',
    paddingHorizontal: '$smallSpacing',
  },
  containerAngledBorder1: {
    width: Dimensions.get('window').width,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: '$primaryBackgroundColor',
    borderBottomWidth: 0,
    borderLeftWidth: Dimensions.get('window').width * 2,
    borderLeftColor: '#476987',
    borderStyle: 'solid',
  },
  container2: {
    backgroundColor: '#476987',
    paddingHorizontal: '$smallSpacing',
  },
  containerAngledBorder2: {
    width: Dimensions.get('window').width,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: '#476987',
    borderBottomWidth: 0,
    borderLeftWidth: Dimensions.get('window').width * 2,
    borderLeftColor: '$LightBlue',
    borderStyle: 'solid',
  },
  container3: {
    backgroundColor: '$LightBlue',
    paddingHorizontal: '$smallSpacing',
  },
  containerAngledBorder3: {
    width: Dimensions.get('window').width,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: '$LightBlue',
    borderBottomWidth: 0,
    borderLeftWidth: Dimensions.get('window').width * 2,
    borderLeftColor: '#789BAA',
    borderStyle: 'solid',
  },
  container4: {
    backgroundColor: '#789BAA',
    paddingHorizontal: '$smallSpacing',
  },
  containerAngledBorder4: {
    width: Dimensions.get('window').width,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: '#789BAA',
    borderBottomWidth: 0,
    borderLeftWidth: Dimensions.get('window').width * 2,
    borderLeftColor: '$primaryBackgroundColor',
    borderStyle: 'solid',
  },
  headlineHeavy: {
    color: 'white',
    marginTop: 10,
    fontSize: 20,
    fontFamily: 'SFProDisplay-Heavy',
  },
  headline: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'SFCompactText-Bold',
  },
  text: {
    color: 'white',
    marginTop: 10,
  },
  textLight: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Light',
  },
  textValue: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Bold',
  },
  textLast: {
    color: 'white',
    marginBottom: 10,
  },
  textHeader: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '$regularLargeFontSize',
  },
  framedNumber: {
    flexDirection: 'row',
  },
  framedNumberItem: {
    width: 70,
    height: 70,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    borderRadius: 2,
  },
  framedNumberItemText: {
    ...withDefaultBoldFont,
    color: 'black',
    fontSize: 44,
    textAlign: 'center',
    marginTop: 13,
  },
  discardContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    overflow: 'scroll',
  },
  discardSelectorItemContainer,
  discardSelectorPlusContainer,
  discardSelectorItemText: {
    fontSize: '$titleFontSize',
    fontWeight: 'bold',
    color: 'black',
  },
  discardSelectorPlusText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'normal',
    lineHeight: 51,
    width: 50,
    height: 50,
    textAlign: 'center',
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  location: {
    maxWidth: '50%',
    marginRight: '$tinySpacing',
  },
  locationIcon: {
    tintColor: 'white',
  },
})
