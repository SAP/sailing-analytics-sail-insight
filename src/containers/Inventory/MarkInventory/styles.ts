import EStyleSheets from 'react-native-extended-stylesheet'
import { white, withDefaultBoldFont, withDefaultFont } from 'styles/compositions/text'

const markTextFontSize = 17;

export default EStyleSheets.create({
  mainContainer: {
    backgroundColor: '$primaryBackgroundColor',
    flex: 1,
    paddingTop: 30,
    width: '100%',
    height: '100%',
  },

  createNewContainer: {
    backgroundColor: '#476987',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 5,
    margin: 15,
    marginTop: 0,
  },

  createNewClassContainer: {
    flexDirection: 'row',
  },

  createNewClassSelectorItem: {
    flex: 1,
    justifyContent: 'center',
  },

  createNewClassSelectorItemText: {
    ...withDefaultFont,
    ...white,
    textAlign: 'center',
  },

  createNewTitle: {
    ...withDefaultFont,
    ...white,
    textAlign: 'center',
  },

  title: {
    ...withDefaultBoldFont,
    ...white,
    fontSize: 20,
    margin: 15,
  },

  markListContainer: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 30,
  },

  markContainer: {
    backgroundColor: 'white',
    marginBottom: 15,
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  },

  markName: {
    ...withDefaultBoldFont,
    fontSize: markTextFontSize,
    flex: 1,
  },

  markShortName: {
    ...withDefaultFont,
    fontSize: markTextFontSize,
  },

  markEllipses: {
    ...withDefaultFont,
    fontSize: markTextFontSize,
  },
})
