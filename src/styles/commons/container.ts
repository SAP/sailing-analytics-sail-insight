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
  logo: {
    height: 30,
    width: 60,
    resizeMode: 'contain',
    marginLeft: 16,
  },
  mediumHorizontalMargin: {
    marginLeft: '12%',
    marginRight: '12%',
  },
  mediumHorizontalPadding: {
    paddingLeft: '12%',
    paddingRight: '12%',
  },
})
