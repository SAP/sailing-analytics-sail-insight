import EStyleSheets from 'react-native-extended-stylesheet'
import { getStatusBarHeight } from 'react-native-status-bar-height'


export default EStyleSheets.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boat: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 37 + getStatusBarHeight(true),
  },
  qrButton: {
    marginBottom: 30,
  },
  claim: {
    marginTop: 30,
  },
})
