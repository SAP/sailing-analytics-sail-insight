import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  size: {
    fontSize: '$regularLargeFontSize',
  },
  text: {
    fontWeight: '300',
    marginTop: '$smallSpacing',
    marginBottom: '$smallSpacing',
  },
  textButtonText: {
    color: '$primaryButtonColor',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  textButtonTextInverted: {
    color: '#476987',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  textColorRegister: {
    color: 'white',
  },
  textColorJoin: {
    color: '#C5C5C5',
  },
})
