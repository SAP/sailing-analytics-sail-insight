import EStyleSheet from 'react-native-extended-stylesheet'


export default EStyleSheet.create({
  $logoSize: 80,
  container: {
    backgroundColor: '$primaryBackgroundColor',
    marginBottom: '$smallSpacing',
  },
  textContainer: {
    paddingHorizontal: '$smallSpacing',
    paddingVertical: 18,
  },
  sailNumber: {
    marginTop: '$microSpacing',
  },
  lowerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentTag: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: '$activeTagColor',
    fontSize: '$regularLargeFontSize',
    fontWeight: '500',
  },
  currentTagText: {
    color: 'white',
  },
  logo: {
    width: '$logoSize',
    height: '$logoSize',
  },
})
