import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'

export default EStyleSheets.create({
  sectionHeaderStyle,
  container: {
    backgroundColor: '$MediumBlue',
    paddingHorizontal: '$smallSpacing',
    paddingBottom: 18
  },
  switchSelector: {
    paddingBottom: 18
  },
  containerAngledBorder: {
    height: 10,
    borderRightColor: '$MediumBlue',
    borderRightWidth: 500,
    borderBottomWidth: 20,
    borderBottomColor: '$LightBlue',
  },
  regattaTypeSelectorText: {
    fontSize: '$largeFontSize',
    letterSpacing: 0.8,
  },
})
