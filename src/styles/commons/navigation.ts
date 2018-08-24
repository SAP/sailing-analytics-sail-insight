import { isPlatformAndroid } from 'helpers/environment'
import { Dimensions } from 'react-native'


const screen = Dimensions.get('window')
const headerTitleStyleProps = isPlatformAndroid ? { flexGrow: 1 } : { width: screen.width }

export default {
  headerTitle: {
    textAlign: 'center',
    alignSelf: 'center',
    ...headerTitleStyleProps,
  },
  headerTitleSmall: {
    textAlign: 'center',
    alignSelf: 'center',
    ...headerTitleStyleProps,
    fontSize: 13,
  },
}
