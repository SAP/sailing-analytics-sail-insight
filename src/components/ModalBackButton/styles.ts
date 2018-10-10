import { Platform } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  back: {
    padding: '$tinySpacing',
  },
  elevation: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 1,
    },
    android: {
      elevation: 1,
    },
  }),
})
