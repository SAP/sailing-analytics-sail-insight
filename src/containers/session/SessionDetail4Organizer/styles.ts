import { Dimensions } from 'react-native';
import EStyleSheets from 'react-native-extended-stylesheet'
import { withSecondaryHeavyFont, withSecondaryLightFont, withSecondaryBoldFont, withTertiaryFont, withDefaultBoldFont } from 'styles/compositions/text';

const $veryLightBlue = '#789BAA'

export default EStyleSheets.create({
  container: {
    backgroundColor: $veryLightBlue,
    width: '100%',
    height: '100%',
  },
  cardsContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '$primaryBackgroundColor',
    paddingTop: '$tinySpacing',
  },
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
  buttonBig: {
    padding: 12,
    backgroundColor: '$Orange',
    margin: 10,
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 1,
    borderColor: '$Orange',
    borderRadius: 5,
  },
  buttonContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    ...withDefaultBoldFont,
  },
  buttonBigContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    ...withDefaultBoldFont,
  },
  container1: {
    alignItems: 'center',
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
    alignItems: 'center',
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
    alignItems: 'center',
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
    borderLeftColor: $veryLightBlue,
    borderStyle: 'solid',
  },
  container4: {
    alignItems: 'center',
    backgroundColor: $veryLightBlue,
    paddingHorizontal: '$smallSpacing',
  },
  containerAngledBorder4: {
    width: Dimensions.get('window').width,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: $veryLightBlue,
    borderBottomWidth: 0,
    borderLeftWidth: Dimensions.get('window').width * 2,
    borderLeftColor: '$primaryBackgroundColor',
    borderStyle: 'solid',
  },
  headlineHeavy: {
    color: 'white',
    fontSize: 20,
    ...withSecondaryHeavyFont,
  },
  headline: {
    color: 'white',
    fontSize: 18,
    ...withDefaultBoldFont,
  },
  headlineTop: {
    backgroundColor: '$primaryBackgroundColor',
    color: 'white',
    fontSize: 20,
    ...withDefaultBoldFont,
    margin: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '$primaryBackgroundColor',
    overflow: 'hidden',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 40,
  },
  text: {
    color: 'white',
    marginTop: 10,
  },
  textLight: {
    color: 'white',
    fontSize: 14,
    ...withSecondaryLightFont,
  },
  textValue: {
    color: 'white',
    fontSize: 14,
    ...withSecondaryBoldFont,
  },
  textLast: {
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
  },
  textHeader: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '$regularLargeFontSize',
  },
  textExplain: {
    textAlign: 'center',
    color: 'white',
    ...withSecondaryLightFont,
    fontSize: 17,
  },
  location: {
    maxWidth: '50%',
    marginRight: '$tinySpacing',
  },
  locationIcon: {
    tintColor: 'white',
  },
  eventNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  eventNameIcon: {
    marginLeft: 10
  },
  eventNameField: {
    width: '75%'
  }
})
