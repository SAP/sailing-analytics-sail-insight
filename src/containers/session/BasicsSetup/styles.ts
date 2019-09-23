import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle, textInput } from 'containers/session/EventCreation/styles'

export const lighterGray = '#C7C7C7'
export const darkerGray = '#C5C5C5'

export default EStyleSheets.create({
  sectionHeaderStyle,
  textInput,
  container: {
    backgroundColor: '$DarkBlue',
    paddingHorizontal: '$smallSpacing',
  },
  containerAngledBorder: {
    height: 10,
    borderRightColor: '$DarkBlue',
    borderRightWidth: 500,
    borderBottomWidth: 20,
    borderBottomColor: '$MediumBlue',
  },
  fieldBoxContainer: {
    backgroundColor: 'white',
    paddingHorizontal: '$smallSpacing',
    paddingVertical: '$smallSpacing',
    marginBottom: '$smallSpacing',
    borderRadius: 2
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
    marginRight: '$smallSpacing'
  }
})
