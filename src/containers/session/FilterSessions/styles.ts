import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingVertical: '$baseSpacing',
  },
  headerContainer: {
    flex: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: '$largeFontSize',
    color: '$secondaryTextColor'
  },
  selectionContainer: {
    flex: 80,
  },
  buttonContainer: {
    flex: 10,
    paddingHorizontal: '$baseSpacing',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    marginHorizontal: '$smallSpacing',
  },
})
