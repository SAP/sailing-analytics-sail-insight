import EStyleSheet from 'react-native-extended-stylesheet'


export default EStyleSheet.create({
  container: {
    backgroundColor: '$primaryBackgroundColor',
  },
  innerContainer: {
    marginTop: 40,
    marginBottom: 44,
  },
  closeButton: {
    width: '$defaultIconSize',
    height: '$defaultIconSize',
    position: 'absolute',
    top: 0,
    right: 0,
    resizeMode: 'contain',
    tintColor: '$secondaryButtonColor',
    marginRight: 16,
    marginTop: 24,
  },
  title: {
    marginTop: 29,
  },
  text: {
    marginTop: 9,
  },
  image: {
    resizeMode: 'contain',
    width: 113,
    height: 113,
    alignSelf: 'center',
  },
})
