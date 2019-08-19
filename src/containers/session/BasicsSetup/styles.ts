import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'

export default EStyleSheets.create({
  sectionHeaderStyle,
  container: {
    backgroundColor: '$DarkBlue',
    paddingHorizontal: '$smallSpacing',
  },
  fieldBoxContainer: {
    backgroundColor: 'white',
    paddingHorizontal: '$smallSpacing',
    paddingVertical: '$smallSpacing',
    marginBottom: '$smallSpacing',
  },
  fieldBoxLabel: {
    fontSize: '$largeFontSize',
    fontWeight: 'bold',
    color: 'black'
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '$tinySpacing',
  },
})
