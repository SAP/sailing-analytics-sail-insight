import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'

export const lighterGray = '#C7C7C7'
export const darkerGray = '#C5C5C5'

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
  formDatePickerContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: lighterGray,
    alignItems: 'center',
  },
})
