import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: {
    alignSelf: 'stretch',
    marginTop: '$smallSpacing',
    marginBottom: '$smallSpacing',
  },
  redBalloon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '$smallSpacing',
    paddingVertical: '$tinySpacing',
    backgroundColor: '#FD3737',
    borderRadius: '$baseBorderRadius',
  },
  redBalloonText: {
    flex: 1,
    color: '#FFFFFF',
  },
  attention: {
    width: 16,
    height: 16,
    marginRight: '$smallSpacing',
  },
})
