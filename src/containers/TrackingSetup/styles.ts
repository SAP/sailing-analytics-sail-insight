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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  keyValue: {
    marginTop: 12,
  },
  startButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '$importantHighlightColor',
    alignSelf: 'center',
    marginBottom: 32,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
