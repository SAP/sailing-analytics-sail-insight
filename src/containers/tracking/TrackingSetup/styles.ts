import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  $shareSpacing: '$smallSpacing+4',
  infoContainer: {
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  titleRow: {
    marginTop: '$smallSpacing',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyValue: {
    marginTop: 12,
  },
  startButton: {
    backgroundColor: '$importantHighlightColor',
    marginBottom: 32,
  },
  shareContainer: {
    marginTop: 40,
    marginBottom: 32,
  },
  shareButton: {
    marginTop: '$shareSpacing',
    marginBottom: '$shareSpacing',
  },
})
