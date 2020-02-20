import EStyleSheets from 'react-native-extended-stylesheet'

export default EStyleSheets.create({
  label: {
    color: '$primaryTextColor',
    fontSize: '$largeFontSize',
    fontWeight: 'bold',
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  switchSelector: {
    marginTop: '$tinySpacing',
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  switchSelectorText: {
    fontSize: '$largeFontSize',
  },
})
