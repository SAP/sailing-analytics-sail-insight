import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'

const windowHeight = Dimensions.get('window').height

const oldImageStyles = {
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
    marginRight: '$smallSpacing',
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
}

export default EStyleSheets.create({

  // Keep these around for now
  ...oldImageStyles,

  siHeaderLarge: {
    width: '100%',
    resizeMode: 'cover',
    height: Dimensions.get('window').height * 0.39
  },

  $siLogoSize: 80,

  siLogoAbsoluteLeft: {
    width: '$siLogoSize',
    height: '$siLogoSize',
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: '$siBaseSpacing * 2',
    marginTop: '$siBaseSpacing * 2'
  },


})
