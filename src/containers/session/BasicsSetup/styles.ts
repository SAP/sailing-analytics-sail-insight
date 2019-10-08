import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle, textInput } from 'containers/session/EventCreation/styles'
import { Dimensions } from 'react-native'

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
    width: Dimensions.get('window').width,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: '$DarkBlue',
    borderBottomWidth: 0,
    borderLeftWidth: Dimensions.get('window').width * 2,
    borderLeftColor: '$MediumBlue',
    borderStyle: 'solid',
  },
  fieldBoxContainer: {
    backgroundColor: 'white',
    paddingHorizontal: '$smallSpacing',
    paddingVertical: '$smallSpacing',
    marginBottom: '$smallSpacing',
    borderRadius: 2,
  },
  fieldBoxLabel: {
    fontSize: '$largeFontSize',
    fontWeight: 'bold',
    color: 'black',
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
    marginRight: '$smallSpacing',
  },
})
