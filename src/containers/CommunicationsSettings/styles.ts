import EStyleSheets from 'react-native-extended-stylesheet'
import { withSecondaryLightFont, withSecondaryHeavyFont, withDefaultBoldFont } from 'styles/compositions/text'

export default EStyleSheets.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
    marginTop: '$smallSpacing',
  },
  item: {
    padding: '$tinySpacing',
    marginBottom: 8,
    color: 'white',
    fontSize: 16,
    ...withSecondaryLightFont,
  },
  itemText: {
    flexDirection: 'row',
  },
  item2: {
    padding: '$tinySpacing',
    marginBottom: 0,
    color: 'white',
  },
  title: {
    color: 'white',
    fontSize: 16,
    ...withSecondaryHeavyFont,
    flex: 1,
  },
  red: {
    color: 'red',
  },
  green: {
    color: 'green',
  },
  text: {
    color: 'white',
    fontSize: 16,
    ...withSecondaryLightFont,
    justifyContent: 'flex-end',
  },
  button: {
    padding: 12,
    backgroundColor: 'transparent',
    margin: 10,
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 5,
  },
  buttonContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    ...withDefaultBoldFont,
  },
  textContainer: {
    flexDirection: 'column',
    flexGrow: 2,
    display: 'flex',
    alignItems: 'stretch',
  },
  textContainerBlack: {
    height: '40%',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'black',
  },
})
