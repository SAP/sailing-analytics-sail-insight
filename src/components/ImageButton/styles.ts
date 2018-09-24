import EStyleSheet from 'react-native-extended-stylesheet'


export default EStyleSheet.create({
  container: {
    width: '$defaultImageButtonSize',
    height: '$defaultImageButtonSize',
    overflow: 'hidden',
  },
  image: {
    width: null,
    height: null,
    flex: 1,
    resizeMode: 'contain',
  },
})
