import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  mapContainer: {
    flex: 1
  },
  map: {
    ...EStyleSheets.absoluteFillObject,
  },
})
