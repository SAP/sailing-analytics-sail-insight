import { Platform } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: {
    paddingTop: Platform.select({
      ios: 30,
    }),
  },
})
