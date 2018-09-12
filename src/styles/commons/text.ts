import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  propertyName: {
    fontSize: 12,
    fontWeight: '500',
    color: '$secondaryTextColor',
  },
  propertyValue: {
    fontSize: 16,
    fontWeight: '300',
  },
  error: {
    color: '$importantHighlightColor',
  },
  claim: {
    alignSelf: 'stretch',
    fontSize: '$claimFontSize',
    fontWeight: 'bold',
  },
  claimHighlighted: {
    color: '$primaryActiveColor',
  },
})
