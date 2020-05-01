import EStyleSheets from 'react-native-extended-stylesheet'
import { withDefaultBoldFont } from 'styles/compositions/text'

export default EStyleSheets.create({
  button: {
    padding: 5,
    backgroundColor: 'transparent',
    margin: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 5,
    width: 80,
  },
  buttonContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    ...withDefaultBoldFont,
  },
  console: {
    backgroundColor: 'black',
    marginTop: '$smallSpacing',
    marginBottom: '$smallSpacing',
    height: 300,
    padding: '$smallSpacing',
  },
  consoleBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disabled: {
    opacity: 0.5,
  },
  active: {
    opacity: 1,
  },
})
