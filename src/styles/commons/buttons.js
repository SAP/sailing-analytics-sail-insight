import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  action: {
    backgroundColor: '$actionButtonColor',
    padding: 8,
    width: 50,
    height: 50,
  },
  navigationBack: {
    color: '$actionButtonColor',
    paddingRight: '$containerFixedMargin',
    fontSize: 17,
  },
})
