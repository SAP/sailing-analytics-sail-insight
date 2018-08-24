import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  container: {
    alignItems: 'center',
  },
  heading: {
    fontSize: '$paragraphFontSize',
    fontWeight: '$boldFontWeight',
  },
  subHeading: {
    fontSize: '$subParagraphFontSize',
  },
})
