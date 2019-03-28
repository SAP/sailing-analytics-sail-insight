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
    alignSelf: 'stretch',
  },
  title: {
    flex: 1,
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
  betaButton: {
    // styles are a bit hacky, but this button will be removed soon
    marginBottom: '$shareSpacing-5',
    backgroundColor: '$importantHighlightColor',
    alignSelf: 'flex-end',
    width: 60,
    height: 28,
    borderRadius: '$baseBorderRadius',
    marginRight: '$shareSpacing',
    marginTop: -45
  },
  betaButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '$titleFontSize-2',
    letterSpacing: -0.5,
  },
  disabledShareButton: {
    color: '$primaryInactiveColor',
    backgroundColor: 'transparent',
  },
})
