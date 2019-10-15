import EStyleSheets from 'react-native-extended-stylesheet'
import { white, withDefaultBoldFont, withDefaultFont } from 'styles/compositions/text'

export default EStyleSheets.create({
  mainContainer: {
    backgroundColor: '$primaryBackgroundColor'
  },

  title: {
    ...withDefaultBoldFont,
    ...white,
    fontSize: 20
  }
})
