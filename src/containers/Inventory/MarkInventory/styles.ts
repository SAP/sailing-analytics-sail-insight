import EStyleSheets from 'react-native-extended-stylesheet'
import { white, withDefaultBoldFont, withDefaultFont } from 'styles/compositions/text'

export default EStyleSheets.create({
  mainContainer: {
    backgroundColor: '$primaryBackgroundColor',
    flex: 1
  },

  createNewContainer: {
    backgroundColor: '#476987',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 5,
    margin: 15,
    marginTop: 0,
  },

  createNewClassContainer: {
    flexDirection: 'row',
  },

  createNewClassSelectorItem: {
      flex: 1,
      justifyContent: 'center'
  },

  createNewClassSelectorItemText: {
      ...withDefaultFont,
      ...white,
      textAlign: 'center'
  },

  createNewTitle: {
    ...withDefaultFont,
    ...white,
    textAlign: 'center'
  },

  title: {
    ...withDefaultBoldFont,
    ...white,
    fontSize: 20,
    margin: 15,
    marginBottom: 0
  },

  markListContainer: {
    marginLeft: 15,
    marginRight: 15
  },

  markContainer: {
    backgroundColor: 'white',
    marginBottom: 15,
    height: 90,
    flexDirection: 'row',
    alignItems: 'center'
  }
})
