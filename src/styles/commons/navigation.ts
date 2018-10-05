import { isPlatformAndroid } from 'helpers/environment'
import { Dimensions } from 'react-native'

import { $defaultFontFamily, $titleFontSize } from 'styles/fonts'


const screen = Dimensions.get('window')
const headerTitleStyleProps = isPlatformAndroid ?
  { /* flexGrow: 1 */ } :
  { /* width: screen.width */ }

export default {
  headerTitle: {
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: $defaultFontFamily,
    fontSize: $titleFontSize,
    fontWeight: '500',
    ...headerTitleStyleProps,
  },
  headerTitleSmall: {
    textAlign: 'center',
    alignSelf: 'center',
    ...headerTitleStyleProps,
    fontSize: '$regularLargeFontSize',
  },
}
