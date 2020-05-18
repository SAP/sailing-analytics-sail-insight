import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: {
    flex: 1,
    backgroundColor: '$primaryBackgroundColor',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
    height: 70,
    marginBottom: 15,
    justifyContent: 'center',
  },
  itemText: {
    color: 'black',
    marginLeft: 20,
    flex: 1
  }
})
