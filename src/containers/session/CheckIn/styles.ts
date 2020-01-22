import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#12374866',
  },
  textContainer: {
    flex: 1,
    marginTop: 90,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  claim: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'SFProDisplay-Heavy',
    marginTop: 30,
  },
  subClaim: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Medium',
    marginTop: 16,
  },
  qrButton: {
    marginBottom: 30,
  },
  qrButtonText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'SFProDisplay-Heavy',
  },
})
