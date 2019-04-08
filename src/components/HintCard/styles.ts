import EStyleSheet from 'react-native-extended-stylesheet'


export default EStyleSheet.create({
  container: {
    backgroundColor: '$primaryBackgroundColor',
  },
  innerContainer: {
    marginTop: '$largeSpacing-8',
    marginBottom: '$largeSpacing-4',
  },
  closeButton: {
    width: '$defaultIconSize',
    height: '$defaultIconSize',
    position: 'absolute',
    top: 0,
    right: 0,
    resizeMode: 'contain',
    tintColor: '$secondaryButtonColor',
    marginRight: '$smallSpacing',
    marginTop: '$baseSpacing',
  },
  title: {
    marginTop: '$baseSpacing+5',
  },
  text: {
    marginTop: '$tinySpacing+1',
  },
  image: {
    resizeMode: 'contain',
    width: 113,
    height: 113,
    alignSelf: 'center',
  },
})
