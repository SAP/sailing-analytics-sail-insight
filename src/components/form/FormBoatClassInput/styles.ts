import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  container: {
    flex: 1,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
  },
  inputContainer: {
    borderWidth: 0,
    marginBottom: 0,
  },
  list: {
    backgroundColor: 'white',
    borderTopWidth: 0,
    borderColor: '$primaryInactiveColor',
    margin: 10,
    marginTop: 0,
    position: 'relative',
  },
  listItem: {
    borderTopWidth: 1,
    borderColor: '$primaryInactiveColor',
    paddingLeft: 15,
    paddingTop: 6,
    height: 41,
  },
  icon: {
    height: 25,
    width: 25,
    position: 'absolute',
    top: 5,
    right: 5,
    resizeMode: 'contain',
  },

})
