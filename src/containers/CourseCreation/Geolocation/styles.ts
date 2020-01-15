import EStyleSheets from 'react-native-extended-stylesheet'

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
  }
})
