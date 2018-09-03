import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'

const windowHeight = Dimensions.get('window').height

export default EStyleSheets.create({
  $tagLineHeight: 56,
  $tagLineRatio: 3.318,
  $claimMargin: '12%',
  headerImage: {
    width: '100%',
    height: windowHeight * 0.26,
    resizeMode: 'cover',
  },
  tagLine: {
    height: '$tagLineHeight',
    alignSelf: 'flex-end',
    resizeMode: 'contain',
    width: '$tagLineHeight*$tagLineRatio',
    marginRight: '$containerFixedMargin',
  },
  claim: {
    marginTop: 21,
  },
  loginButton: {
    alignSelf: 'center',
    marginTop: 29,
  },
  bottomContainer: {
    paddingTop: '$containerFixedMargin',
    paddingBottom: 37,
  },
  nextButton: {
    marginTop: 32,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  help: {
    marginTop: 24,
  },
})
