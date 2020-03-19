import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { withSecondaryLightFont, withSecondaryMediumFont, withSecondaryHeavyFont } from 'styles/compositions/text'

const headerImageBackgroundColor = '#2699FB'
export const deleteBindingColor = '#466888'
const deleteBindingFontSize = 14

const windowHeight = Dimensions.get('window').height
const skipAndroid = false

export default EStyleSheets.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  connectivity: {
    backgroundColor: headerImageBackgroundColor,
    paddingTop: getStatusBarHeight(skipAndroid),
  },
  headerImage: {
    width: '100%',
    resizeMode: 'contain',
    height: windowHeight * 0.40,
    backgroundColor: headerImageBackgroundColor
  },
  trackingButton: {
    marginBottom: 30,
    backgroundColor: '#FF6B4C',
  },
  trackingButtonText: {
    color: 'white',
    fontSize: 24,
    letterSpacing: 1.5,
    ...withSecondaryHeavyFont,
  },
  accuracyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  accuracyTitle: {
    color: 'black',
    ...withSecondaryLightFont,
    fontSize: 18,
    marginRight: 15,
  },
  accuracyValue: {
    color: 'black',
    ...withSecondaryHeavyFont,
    fontSize: 22,
  },
  informationDisplayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIconStyle: {
    width: 14,
    height: 14,
  },
  deleteBindingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteBindingText: {
    fontSize: deleteBindingFontSize,
    color: deleteBindingColor,
    marginLeft: 5,
    ...withSecondaryMediumFont,
  },
  markName: {
    color: 'black',
    fontSize: 24,
    ...withSecondaryHeavyFont,
  }
})
