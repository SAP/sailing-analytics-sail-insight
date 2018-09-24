import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const windowHeight = Dimensions.get('window').height
const skipAndroid = true
const topMargin = windowHeight * 0.057


export default EStyleSheets.create({
  container: {
    flex: 1,
    marginTop: 37,
  },
  connectivity: {
    marginTop: getStatusBarHeight(skipAndroid),
  },
  stopButton: {
    marginTop: 24,
    backgroundColor: '$primaryTextColor',
  },
  informationItem: {
    padding: '$tinySpacing',
  },
  propertyRow: {
    marginTop: topMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagLine: {
    height: 56,
    width: '100%',
    // alignSelf: 'stretch',
    resizeMode: 'contain',
    marginBottom: 20,
    marginTop: 8,
  },
  property: {
    marginTop: topMargin,
  },
  dynamicPropertyContainer: {
    flex: 0.5,
  },
})
