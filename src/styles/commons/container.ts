import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '$primaryBackgroundColor',
  },
  list: {
    flex: 1,
    backgroundColor: '$secondaryBackgroundColor',
  },
  content: {
    flexGrow: 1,
  },
  stretchContent: {
    alignSelf: 'stretch',
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
  },
  logo: {
    height: 30,
    width: 60,
    resizeMode: 'contain',
    marginLeft: 16,
  },
})
