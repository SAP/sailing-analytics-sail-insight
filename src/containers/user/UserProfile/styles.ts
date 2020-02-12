import EStyleSheets from 'react-native-extended-stylesheet'
import { withSecondaryLightFont, withSecondaryHeavyFont, withSecondaryMediumFont } from 'styles/compositions/text'


export default EStyleSheets.create({
  topInput: {
    marginTop: '$smallSpacing',
    marginBottom: '$tinySpacing',
  },
  inputContainer: {
    backgroundColor: 'transparent',
  },
  inputStyle: {
    fontSize: 16,
    ...withSecondaryLightFont,
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  inputField: {
    paddingLeft: '$smallSpacing',
    paddingRight: '$smallSpacing',
  },
  buttonContainer: {
    height: 70,
    marginBottom: '$tinySpacing',
    padding: '$smallSpacing',
  },
  title: {
    color: 'white',
    fontSize: 12,
    ...withSecondaryHeavyFont,
  },
  text: {
    color: 'white',
    fontSize: 16,
    ...withSecondaryLightFont,
  },
  bottomButtonField: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 50,
    marginTop: 'auto',
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
  },
  saveButton: {
    backgroundColor: '$primaryButtonColor',
    marginTop: 20,
    alignSelf: 'stretch',
    height: 56,
    borderRadius: '$baseBorderRadius',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    ...withSecondaryHeavyFont,
  },
  logoutButton: {
    marginTop: '$smallSpacing',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '$primaryButtonColor',
    fontSize: 14,
    ...withSecondaryMediumFont,
  },
})
