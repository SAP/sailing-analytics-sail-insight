import { Dimensions } from 'react-native'

export default {
  container: { flex: 1 },
  camera: {
    height: '100%',
    width: '100%',
  },
  marker: {
    height: Dimensions.get('window').width * 0.8,
    width: Dimensions.get('window').width * 0.8,
    borderWidth: 4,
    borderColor: '#FF6C52',
    backgroundColor: 'transparent',
  },
  bottomInfoField: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 80,
    left: 0,
    right: 0,
    paddingLeft: 16,
    paddingRight: 16,
  },
  infoBalloon: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FF6C52',
    borderRadius: 3,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  infoBalloonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
}
