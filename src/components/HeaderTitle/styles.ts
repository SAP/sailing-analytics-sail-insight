import { Dimensions } from 'react-native'

import { isPlatformAndroid } from 'helpers/environment'
import EStyleSheets from 'react-native-extended-stylesheet'

const screen = Dimensions.get('window')
const headerTitleStyleProps = isPlatformAndroid ? { flexGrow: 1 } : { width: screen.width }

export default EStyleSheets.create({
  container: {
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    ...headerTitleStyleProps,
  },
  heading: {
    fontSize: '$regularLargeFontSize',
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: '$smallFontSize',
  },
})
