import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
    marginTop: '$smallSpacing',
  },
  item: {
    paddingLeft: 10,
    color: 'white',
    fontSize: 16,
  },
  itemText: {
    flexDirection: 'row',
  },
  red: {
    color: 'red',
  },
  green: {
    color: 'green',
  },
})
