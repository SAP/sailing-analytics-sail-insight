import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { $tinySpacing, $smallSpacing } from 'styles/dimensions'
import { withSecondaryLightFont, withSecondaryHeavyFont, withDefaultBoldFont } from 'styles/compositions/text'

const windowHeight = Dimensions.get('window').height
const skipAndroid = true
const topMargin = windowHeight * 0.057


export default EStyleSheets.create({
  container: {
    flex: 1,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  measurementContainer: {
    backgroundColor: 'white',
    padding: '$tinySpacing',
    width: '100%',

  },
  measurementTitle: {
    color: 'black',
    fontSize: 16,
    ...withSecondaryLightFont,
  },
  measurementValue: {
    color: 'black',
    fontSize: 30,
    ...withSecondaryHeavyFont,
  },
  measurementValueBig: {
    color: 'black',
    fontSize: 60,
    ...withSecondaryHeavyFont,
  },
  rank: {
    paddingLeft: 32,
  },
  rankTitle: {
    color: 'white',
    fontSize: 14,
    ...withDefaultBoldFont,
    textAlign: 'center',
  },
  rankText: {
    color: '$Orange',
    fontSize: 60,
    ...withSecondaryHeavyFont,
  },
  connectivity: {
    marginTop: getStatusBarHeight(skipAndroid),
  },
  stopButton: {
    marginTop: 24,
    marginBottom: 24,
  },
  informationItem: {
    padding: '$tinySpacing',
  },
  propertyRow: {
    marginTop: '$smallSpacing',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyReverseRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  tagLine: {
    height: 56,
    alignSelf: 'flex-end',
    resizeMode: 'contain',
    marginBottom: 20,
    marginTop: 8,
  },
  property: {
    marginTop: '$tinySpacing',
  },
  propertyBottom: {
    marginBottom: '$tinySpacing',
  },
  dynamicPropertyContainer: {
    flex: 0.5,
  },
  leftPropertyContainer: {
    width: Dimensions.get('window').width / 2 - $tinySpacing / 2 - $smallSpacing,
    marginRight: $tinySpacing / 2,
  },
  rightPropertyContainer: {
    marginLeft: $tinySpacing / 2,
    width: Dimensions.get('window').width / 2 - $tinySpacing / 2 - $smallSpacing,
  },
  rankIcon: {
    tintColor: '$Orange',
  },
  windIcon: {
    tintColor: 'black',
  },
  contextName: {
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
    marginTop: '$tinySpacing',
    color: '$secondaryTextColor',
    fontSize: '$regularFontSize',
    alignSelf: 'center',
  },
})
