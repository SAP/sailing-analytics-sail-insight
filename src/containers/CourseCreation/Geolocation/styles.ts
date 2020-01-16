import EStyleSheets from 'react-native-extended-stylesheet'
import { white, withDefaultBoldFont, withDefaultFont } from 'styles/compositions/text'


export default EStyleSheets.create({
  mapContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    ...EStyleSheets.absoluteFillObject,
  },
  markerContainer: {
    position: 'absolute'
  },
  coordinatesTitle: {
    ...white,
    ...withDefaultBoldFont,
    fontSize: 22,
    marginBottom: 10
  },
  coordinatesInput: {
    backgroundColor: '$DarkBlue',
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderRadius: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 15,
    paddingRight: 15,
    flex: 0,
    fontSize: 20,
  },
  inputContainer: {
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    margin: 0,
    borderRadius: 0,
    paddingLeft: 0,
    paddingRight: 0,
    flex: 0,
  },
  inputMainContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    padding: 0,
    marginLeft: 0,
  },
  coordinatesContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    backgroundColor: '$DarkBlue',
    borderRadius: 4
  },
  coordinatesControlContainer: {
    flexDirection: 'row',
    flex: 1
  },
  coordinatesModalContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10
  },
  switchSelectorContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  switchSelectorText: {
    ...white,
    ...withDefaultBoldFont,
    fontSize: 20
  },
  symbolText: {
    ...white,
    ...withDefaultFont,
    fontSize: 20,
    marginRight: 30,
    marginLeft: -5
  }
})
