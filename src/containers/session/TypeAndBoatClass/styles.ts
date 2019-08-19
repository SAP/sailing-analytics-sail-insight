import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'

export default EStyleSheets.create({
  sectionHeaderStyle,
  container: {
    backgroundColor: '$MediumBlue',
    paddingHorizontal: '$smallSpacing',
  },
  regattaTypeSelectorText: {
    fontSize: '$largeFontSize',
    letterSpacing: 0.8,
  },
})
