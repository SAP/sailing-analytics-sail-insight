import EStyleSheets from 'react-native-extended-stylesheet'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { withSecondaryHeavyFont, withSecondaryMediumFont } from 'styles/compositions/text'


export default EStyleSheets.create({
  textContainer: {
    marginLeft: '$largeRelativeSpacing',
    marginRight: '$largeRelativeSpacing',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  textClaim: {
    marginTop: '$tinySpacing',
    marginBottom: '$tinySpacing',
    fontSize: 26,
    ...withSecondaryHeavyFont,
  },
  timeText: {
    color: 'white',
    marginTop: '$largeSpacing',
  },
  location: {
    marginTop: 16,
    maxWidth: '50%',
    marginRight: '$tinySpacing',
  },
  locationIcon: {
    tintColor: 'white',
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 12 + getStatusBarHeight(true),
  },
  bottomButtonField: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 'auto',
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
  },
  joinButton: {
    backgroundColor: '$Orange',
    marginTop: 20,
    alignSelf: 'stretch',
    height: 56,
    borderRadius: '$baseBorderRadius',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    ...withSecondaryHeavyFont,
  },
  textButtonText: {
    color: '$primaryButtonColor',
    fontSize: 14,
    ...withSecondaryMediumFont,
  },
  textButtonTextWhite: {
    color: 'white',
    fontSize: 14,
    ...withSecondaryMediumFont,
  },
})
