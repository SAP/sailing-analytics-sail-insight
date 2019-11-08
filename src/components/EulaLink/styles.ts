import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  size: {
    fontSize: '$regularLargeFontSize',
  },
  text: {
    fontWeight: '300',
    marginTop: '$smallSpacing',
    marginBottom: '$smallSpacing',
    textAlign: 'center',
  },
  textButtonText: {
    color: '$primaryButtonColor',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Bold',
  },
  textColorRegister: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
})
