import EStyleSheets from 'react-native-extended-stylesheet'


export default EStyleSheets.create({
  infoContainer: {
    marginLeft: '$containerFixedMargin',
    marginRight: '$containerFixedMargin',
  },
  titleRow: {
    marginTop: '$containerFixedMargin',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  edit: {
    width: '$defaultIconSize',
    height: '$defaultIconSize',
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
    marginTop: 20,
    marginBottom: 20,
  },
})
