import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: {
    alignSelf: 'stretch',
    marginTop: '$smallSpacing',
  },
  redBalloon: {
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
    backgroundColor: '#FD3737',
    borderRadius: '$baseBorderRadius',
    position: 'relative',
  },
  redBalloonText: {
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: '$tinySpacing',
    marginBottom: '$tinySpacing',
  },
  attention: {
    position: 'absolute',
    left: 20,
    height: '100%',
    width: 16,
  },
})
