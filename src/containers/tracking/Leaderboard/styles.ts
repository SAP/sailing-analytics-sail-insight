import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const windowHeight = Dimensions.get('window').height
const skipAndroid = true
const topMargin = windowHeight * 0.057

const indicatorSize = 24

export default EStyleSheets.create({
  container: {
    flex: 1,
    marginTop: 10,
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
    color: '$secondaryTextColor',
    fontSize: '$regularFontSize',
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  nameText: {
    color: '$secondaryTextColor',
    fontSize: 16,
    letterSpacing: -0.8,
    marginLeft: 10,
    maxWidth: 130,
  },
  flag: {
    marginLeft: 35,
  },
  rankText: {
    color: '$primaryTextColor',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.8,
  },
  gapText: {
    color: '$primaryTextColor',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.8,
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
    backgroundColor: '$primaryBackgroundColor',
  },
  listContainer: {
    flex: 3.5,
  },
  connectivity: {
    marginTop: getStatusBarHeight(skipAndroid),
  },
  propertyRow: {
    marginTop: topMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightPropertyContainer: {
    marginLeft: '$tinySpacing',
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
