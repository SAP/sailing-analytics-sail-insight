import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: {
    marginBottom: '$tinySpacing'
  },
  leftAction: {
    width: 200,
    backgroundColor: '$primaryButtonColor',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginRight: -10
  },
  actionImage: {
    justifyContent: 'center',
  }
})
