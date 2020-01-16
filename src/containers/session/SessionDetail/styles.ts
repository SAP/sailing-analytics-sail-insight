import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  container: {
    backgroundColor: '$primaryBackgroundColor',
    paddingTop: '$tinySpacing',
    width: '100%',
    height: '100%',
  },
  cardsContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '$primaryBackgroundColor',
  },
})
