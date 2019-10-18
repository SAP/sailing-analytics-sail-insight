import EStyleSheets from 'react-native-extended-stylesheet'
import { getStatusBarHeight } from 'react-native-status-bar-height'


export default EStyleSheets.create({
  textContainer: {
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  textClaim: {
    marginTop: '$tinySpacing',
    fontSize: 24,
    fontFamily: 'SFProDisplay-Heavy',
  },
  timeText: {
    color: '$detailsTextColor',
    marginTop: '$largeSpacing',
  },
  location: {
    marginTop: 9,
  },
  locationIcon: {
    tintColor: '$secondaryTextColor',
  },
  locationText: {
    color: '$primaryTextColor',
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
    backgroundColor: '#FF6C52',
    marginTop: 20,
    alignSelf: 'stretch',
    height: 56,
    borderRadius: '$baseBorderRadius',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'SFProDisplay-Heavy',
  },
  textButtonTextInverted: {
    color: '#476987',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
})
