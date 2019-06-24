import EStyleSheets from 'react-native-extended-stylesheet'
import { Platform } from 'react-native'

export default EStyleSheets.create({
  container: {
    paddingTop: Platform.select({
        ios: 30
    })
  }
})
