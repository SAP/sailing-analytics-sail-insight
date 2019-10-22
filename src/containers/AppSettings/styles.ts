import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: { flex: 1 },
  item: {
    backgroundColor: 'white',
    padding: '$tinySpacing',
    marginBottom: 8,
  },
  lastButton: {
    marginBottom: 16,
  },
  boldText: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-Heavy',
  },
  text: {
    marginTop: '$microSpacing',
    fontSize: '$regularLargeFontSize',
  },
})
