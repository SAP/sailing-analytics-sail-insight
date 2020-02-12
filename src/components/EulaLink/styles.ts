import EStyleSheet from 'react-native-extended-stylesheet'
import { withSecondaryMediumFont, withSecondaryBoldFont } from 'styles/compositions/text'

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
    ...withSecondaryBoldFont,
  },
  textColorRegister: {
    color: '#FFFFFF',
    fontSize: 14,
    ...withSecondaryMediumFont,
  },
})
