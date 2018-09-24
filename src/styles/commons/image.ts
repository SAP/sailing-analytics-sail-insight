import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'

const windowHeight = Dimensions.get('window').height

export default EStyleSheets.create({
  $tagLineHeight: 56,
  $tagLineRatio: 3.318,
  $logoSize: 80,
  $headerWidth: '100%',
  $headerResizeMode: 'cover',

  headerMedium: {
    width: '$headerWidth',
    resizeMode: '$headerResizeMode',
    height: windowHeight * 0.26,
  },
  headerMediumLarge: {
    width: '$headerWidth',
    resizeMode: '$headerResizeMode',
    height: windowHeight * 0.30,
  },
  headerLarge: {
    width: '$headerWidth',
    resizeMode: '$headerResizeMode',
    height: windowHeight * 0.39,
  },
  tagLine: {
    height: '$tagLineHeight',
    alignSelf: 'flex-end',
    resizeMode: 'contain',
    width: '$tagLineHeight*$tagLineRatio',
    marginRight: '$containerFixedMargin',
  },
  logoAbsoluteLeft: {
    width: '$logoSize',
    height: '$logoSize',
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: 15,
    marginTop: 12,
  },
  absoluteLowerRight: {
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginRight: 15,
    marginBottom: 12,
  },
})
