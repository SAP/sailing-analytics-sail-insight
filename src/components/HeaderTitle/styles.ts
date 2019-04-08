import { Dimensions } from 'react-native'

import { isPlatformAndroid } from 'environment'
import EStyleSheets from 'react-native-extended-stylesheet'

const screen = Dimensions.get('window')
const headerTitleStyleProps = isPlatformAndroid ? { flexGrow: 1 } : { width: screen.width }

export default EStyleSheets.create({
  container: {
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    paddingRight: '$mediumSpacing',
    paddingLeft: '$mediumSpacing',
    ...headerTitleStyleProps,
  },
  baseHeading: {
    alignSelf: 'stretch',
  },
  heading: {
    fontSize: '$regularLargeFontSize',
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: '$smallFontSize',
  },
})
