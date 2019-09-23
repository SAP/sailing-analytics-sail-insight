import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  mapContainer: {
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...EStyleSheets.absoluteFillObject,
  },
})
