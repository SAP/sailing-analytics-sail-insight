import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  action: {
    backgroundColor: '$primaryButtonColor',
    padding: 8,
    width: 50,
    height: 50,
  },
  actionRectangular: {
    backgroundColor: '$primaryButtonColor',
    padding: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  actionFullWidth: {
    backgroundColor: '$primaryButtonColor',
    width: '96%',
    alignSelf: 'center',
    height: 80,
    borderRadius: '$actionButtonBorderRadius',
  },
  actionText: {
    color: 'white',
    fontSize: 20,
  },
  textButtonText: {
    color: '$primaryButtonColor',
    fontSize: 16,
  },
  modalBack: {
    color: '$primaryButtonColor',
    fontSize: 17,
  },
  actionIcon: {
    tintColor: '$primaryButtonColor',
    width: 26,
    height: 26,
  },
})
