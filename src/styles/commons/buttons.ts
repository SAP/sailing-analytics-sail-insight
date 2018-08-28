import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  action: {
    backgroundColor: '$actionButtonColor',
    padding: 8,
    width: 50,
    height: 50,
  },
  actionRectangular: {
    backgroundColor: '$actionButtonColor',
    padding: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  actionFullWidth: {
    backgroundColor: '$actionButtonColor',
    width: '96%',
    alignSelf: 'center',
    height: 80,
    borderRadius: '$actionButtonBorderRadius',
  },
  actionText: {
    color: 'white',
    fontSize: 17,
  },
  navigationBack: {
    color: '$actionButtonColor',
    paddingRight: '$containerFixedMargin',
    fontSize: 17,
  },
  actionIcon: {
    tintColor: '$actionButtonColor',
    width: 26,
    height: 26,
  },
})
