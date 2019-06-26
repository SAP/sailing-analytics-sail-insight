import EStyleSheets from 'react-native-extended-stylesheet'

const ICON_SIZE = 50

export default EStyleSheets.create({
  buttonContainer: {
    flex: 1,
  },
  button: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContentContainer: {
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
  },
  icon: {
    tintColor: '#FFFFFF',
    width: ICON_SIZE,
    height: ICON_SIZE,
  }
})
