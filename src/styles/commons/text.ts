import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  propertyName: {
    fontSize: '$regularFontSize',
    fontWeight: '500',
    color: '$secondaryTextColor',
  },
  itemName: {
    fontSize: '$largeFontSize',
    fontWeight: 'bold',
  },
  propertyValue: {
    fontSize: '$largeFontSize',
    fontWeight: '300',
  },
  error: {
    color: '$importantHighlightColor',
  },
  claim: {
    alignSelf: 'stretch',
    fontSize: '$titleFontSize',
    fontWeight: 'bold',
  },
  claimHighlighted: {
    color: '$primaryActiveColor',
  },
})
