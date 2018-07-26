import { Platform, Dimensions } from 'react-native'


const screen = Dimensions.get('window')
const headerTitleStyleProps = Platform.OS === 'android' ? { flexGrow: 1 } : { width: screen.width }

export default {
  headerTitle: {
    textAlign: 'center',
    alignSelf: 'center',
    ...headerTitleStyleProps,
  },
}
