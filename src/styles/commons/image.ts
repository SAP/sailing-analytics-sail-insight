import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'

const windowHeight = Dimensions.get('window').height

export default EStyleSheets.create({
  $tagLineHeight: 56,
  $tagLineRatio: 3.318,

  headerMedium: {
    width: '100%',
    height: windowHeight * 0.26,
    resizeMode: 'cover',
  },
  headerLarge: {
    width: '100%',
    height: windowHeight * 0.39,
    resizeMode: 'cover',
  },
  tagLine: {
    height: '$tagLineHeight',
    alignSelf: 'flex-end',
    resizeMode: 'contain',
    width: '$tagLineHeight*$tagLineRatio',
    marginRight: '$containerFixedMargin',
  },
})
