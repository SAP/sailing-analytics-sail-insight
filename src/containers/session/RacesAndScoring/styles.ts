import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'

export default EStyleSheets.create({
  sectionHeaderStyle,
  container: {
    backgroundColor: '$LightBlue',
    paddingHorizontal: '$smallSpacing',
  },
  textHeader: {
    color: 'white',
    fontWeight: '500',
    fontSize: '$regularFontSize',
  },
  textDescription: {
    color: 'white',
    fontSize: '$largeFontSize',
  },
})
