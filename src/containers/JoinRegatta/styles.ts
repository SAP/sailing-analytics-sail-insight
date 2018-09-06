import EStyleSheets from 'react-native-extended-stylesheet'
import { getStatusBarHeight } from 'react-native-status-bar-height'


export default EStyleSheets.create({
  timeText: {
    color: '$detailsTextColor',
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
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: 15,
    marginTop: 12 + getStatusBarHeight(true),
  },
})
