import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  button: {
    padding: 12,
    backgroundColor: 'transparent', // '#FAFAFA',
    margin: 10,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 5,
  },
  buttonContent: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontFamily: 'SFCompactText-Bold',
  },
  container1: {
    backgroundColor: '$primaryBackgroundColor',
    paddingHorizontal: '$smallSpacing',
  },
  containerAngledBorder1: {
    width: Dimensions.get('window').width,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: '$primaryBackgroundColor',
    borderBottomWidth: 0,
    borderLeftWidth: Dimensions.get('window').width * 2,
    borderLeftColor: '#476987',
    borderStyle: 'solid',
  },
  container2: {
    backgroundColor: '#476987',
    paddingHorizontal: '$smallSpacing',
  },
  containerAngledBorder2: {
    width: Dimensions.get('window').width,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: '#476987',
    borderBottomWidth: 0,
    borderLeftWidth: Dimensions.get('window').width * 2,
    borderLeftColor: '$LightBlue',
    borderStyle: 'solid',
  },
  container3: {
    backgroundColor: '$LightBlue',
    paddingHorizontal: '$smallSpacing',
  },
  containerAngledBorder3: {
    width: Dimensions.get('window').width,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: '$LightBlue',
    borderBottomWidth: 0,
    borderLeftWidth: Dimensions.get('window').width * 2,
    borderLeftColor: '#789BAA',
    borderStyle: 'solid',
  },
  container4: {
    backgroundColor: '#789BAA',
    paddingHorizontal: '$smallSpacing',
  },
  containerAngledBorder4: {
    width: Dimensions.get('window').width,
    height: 0,
    borderTopWidth: 40,
    borderTopColor: '#789BAA',
    borderBottomWidth: 0,
    borderLeftWidth: Dimensions.get('window').width * 2,
    borderLeftColor: '$primaryBackgroundColor',
    borderStyle: 'solid',
  },
  headlineHeavy: {
    color: 'white',
    marginTop: 10,
    fontSize: 20,
    fontFamily: 'SFProDisplay-Heavy',
  },
  headline: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'SFCompactText-Bold',
  },
  text: {
    color: 'white',
    marginTop: 10,
  },
  textLast: {
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
  },
})
