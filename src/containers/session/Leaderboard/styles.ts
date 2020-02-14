import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { $smallSpacing, $tinySpacing } from 'styles/dimensions';
import { withSecondaryHeavyFont, withDefaultBoldFont } from 'styles/compositions/text';

const windowHeight = Dimensions.get('window').height
const skipAndroid = true
const topMargin = windowHeight * 0.057

const indicatorSize = 24

export default EStyleSheets.create({
  container: {
    flex: 1,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  listItemContainer: {
    flex: 1,
    marginTop: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#476987',
    fontSize: 14,
    ...withDefaultBoldFont,
    maxWidth: Dimensions.get('window').width / 2 - $smallSpacing - $tinySpacing,
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
    marginLeft: 35,
  },
  rankTitle: {
    color: 'black',
    fontSize: 14,
    ...withDefaultBoldFont,
  },
  rankText: {
    color: 'black',
    fontSize: 56,
    ...withSecondaryHeavyFont,
  },
  rankTextSmall: {
    color: 'black',
    fontSize: 24,
    ...withSecondaryHeavyFont,
  },
  rankValue: {
    color: 'black',
    fontSize: 56,
    ...withSecondaryHeavyFont,
  },
  gapText: {
    color: 'black',
    fontSize: 56,
    ...withSecondaryHeavyFont,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 2,
    backgroundColor: '$secondaryBackgroundColor',
    marginTop: 3,
    marginBottom: 3,
  },
  listRowContainer: {
    backgroundColor: 'white',
    marginBottom: '$tinySpacing'
  },
  listContainer: {
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
    flex: 3.5,
    marginTop: 55
  },
  dropdownRowText: {
    padding: 10,
    color: 'white',
    backgroundColor: '#476987',
    textAlignVertical: 'center',
    width: Dimensions.get('window').width - 2 *  $smallSpacing,
  },
  connectivity: {
    marginTop: getStatusBarHeight(skipAndroid),
  },
  propertyRow: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftPropertyContainer: {
    margin: '$tinySpacing',
  },
  rightPropertyContainer: {
    margin: '$tinySpacing',
    width: Dimensions.get('window').width / 2 - $smallSpacing - 2 * $tinySpacing,
  },
  triangle: {
    marginLeft: 5,
    fontSize: indicatorSize,
    fontWeight: 'bold',
  },
  triangleEmptySpace: {
    width: indicatorSize,
  },
  green: {
    color: '#64A266',
  },
  red: {
    color: '#EC4C4C',
  },
})
