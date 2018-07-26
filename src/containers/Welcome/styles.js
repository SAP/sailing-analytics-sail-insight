import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  hyperLink: {
    padding: 4,
  },
  hyperLinkText: {
    color: '#1189FE',
    textDecorationLine: 'underline',
  },
  moreInformationText: {
    marginTop: '$containerFixedMargin',
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: '$containerFixedMargin',
  },
})
