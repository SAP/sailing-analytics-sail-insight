import { isPlatformAndroid } from 'environment'
import { Dimensions } from 'react-native'

import { $defaultFontFamily, $titleFontSize } from 'styles/fonts'

import EStyleSheet from 'react-native-extended-stylesheet'


const screen = Dimensions.get('window')
const headerTitleStyleProps = isPlatformAndroid ?
  { /* flexGrow: 1 */ } :
  { /* width: screen.width */ }

export default EStyleSheet.create({
  headerTitle: {
    color: '#fff', // quickfix to set dyn. title in teamdetails to white
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
})
