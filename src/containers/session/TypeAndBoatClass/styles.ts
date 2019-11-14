import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'
import { Dimensions } from 'react-native'
import { withDefaultFont } from 'styles/compositions/text'

export default EStyleSheets.create({
  sectionHeaderStyle,
  container: {
    backgroundColor: '$MediumBlue',
    paddingHorizontal: '$smallSpacing',
    paddingBottom: 18,
  },
  switchSelector: {
    paddingBottom: 25,
  },
  containerAngledBorder: {
    width: Dimensions.get('window').width,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: '$MediumBlue',
    borderBottomWidth: 0,
    borderLeftWidth: Dimensions.get('window').width * 2,
    borderLeftColor: '$LightBlue',
    borderStyle: 'solid',
  },
  regattaTypeSelectorText: {
    fontSize: '$largeFontSize',
    letterSpacing: 0.8,
  },
  boatClassInput: {
    ...withDefaultFont,
  }
})
