import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle, textInput } from 'containers/session/EventCreation/styles'
import { Dimensions } from 'react-native'
import { withDefaultBoldFont } from 'styles/compositions/text'

export const lighterGray = '#C7C7C7'
export const darkerGray = '#C5C5C5'

export default EStyleSheets.create({
  sectionHeaderStyle,
  textInput,
  container: {
    backgroundColor: '#1D3F4E',
    paddingHorizontal: '$smallSpacing',
  },
  containerAngledBorder: {
    width: Dimensions.get('window').width,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: '$primaryBackgroundColor',
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
    ...withDefaultBoldFont,
    fontSize: '$largeFontSize',
    color: 'black',
  },
  dateInputContainer: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '$tinySpacing',
  },
  formDatePickerContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: darkerGray,
    alignItems: 'center',
    marginRight: '$smallSpacing',
  },
})
