import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { $smallSpacing, $tinySpacing } from 'styles/dimensions'
import {
  withSecondaryHeavyFont,
  withSecondaryBoldFont,
  withDefaultBoldFont,
} from 'styles/compositions/text'

const windowHeight = Dimensions.get('window').height
const skipAndroid = true
const topMargin = windowHeight * 0.057

const chooseMetricTextColor = '#476987'
export const topRowValueFontSize = 36
export const normalRowValueFontSize = 24

export default EStyleSheets.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '$primaryBackgroundColor',
  },
  container: {
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  listItemContainer: {
    flex: 1,
    marginTop: 3,
    marginBottom: 3,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: chooseMetricTextColor,
    fontSize: 14,
    ...withSecondaryBoldFont,
    maxWidth:
      Dimensions.get('window').width / 2 - $smallSpacing - $tinySpacing - 30,
  },
  triangleUp: {
    paddingTop: 10,
    paddingLeft: 5,
  },
  triangleDown: {
    paddingTop: 5,
    paddingLeft: 5,
  },
  titleArrow: {
    tintColor: chooseMetricTextColor,
  },
  picker: {
    width: 200,
  },
  nameText: {
    color: 'black',
    fontSize: 16,
    letterSpacing: -0.8,
    marginLeft: 10,
    maxWidth: 130,
  },
  flag: {
    marginLeft: 20,
  },
  header: {
    color: 'white',
    fontSize: 20,
    letterSpacing: 0.2,
    marginLeft: '$smallSpacing',
    marginTop: 20,
    ...withSecondaryBoldFont,
  },
  rankTitle: {
    color: 'black',
    fontSize: 14,
    ...withSecondaryBoldFont,
  },
  rankText: {
    color: 'black',
    fontSize: 56,
    ...withSecondaryHeavyFont,
  },
  rankTextSmall: {
    color: 'black',
    fontSize: 24,
    textAlign: 'right',
    ...withSecondaryHeavyFont,
  },
  gapText: {
    color: 'black',
    fontSize: topRowValueFontSize,
    ...withSecondaryHeavyFont,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTextContainer: {
    flex: 1,
  },
  topRowItemContainer: {
    height: 1.6 * topRowValueFontSize
  },
  separator: {
    height: 2,
    backgroundColor: '$secondaryBackgroundColor',
    marginTop: 3,
    marginBottom: 3,
  },
  listRowButtonContainer: {
    marginBottom: '$tinySpacing',
  },
  listRowContainer: {
    backgroundColor: 'white',
  },
  listContainer: {
    flex: 1,
    marginVertical: 5
  },
  listContentContainer: {
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
    marginTop: 15,
  },
  dropdownRowText: {
    padding: 10,
    color: 'white',
    backgroundColor: '#476987',
    textAlignVertical: 'center',
    width: Dimensions.get('window').width - 2 * $smallSpacing,
  },
  connectivity: {
    marginTop: getStatusBarHeight(skipAndroid),
  },
  propertyRow: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 0,
    paddingLeft: 20,
  },
  leftPropertyContainer: {
    margin: '$tinySpacing',
  },
  rightPropertyContainer: {
    margin: '$tinySpacing',
    width:
      Dimensions.get('window').width / 2 - $smallSpacing - 2 * $tinySpacing,
  },
  triangle: {
    marginLeft: 5,
    fontSize: normalRowValueFontSize,
    fontWeight: 'bold',
  },
  triangleEmptySpace: {
    width: normalRowValueFontSize,
  },
  green: {
    color: '#64A266',
  },
  red: {
    color: '#EC4C4C',
  },
})
