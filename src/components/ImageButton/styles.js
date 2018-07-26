import EStyleSheet from 'react-native-extended-stylesheet'


export default EStyleSheet.create({
  containerStyle: {
    width: '$defaultImageButtonSize',
    height: '$defaultImageButtonSize',
    overflow: 'hidden',
  },
  imageStyle: {
    width: null,
    height: null,
    flex: 1,
    resizeMode: 'contain',
  },
})
