import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDDDDD',
  },
  dot: {
    marginLeft: '$microSpacing',
  },
  text: {
    marginHorizontal: '$microSpacing',
  },
})
