import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  $textButtonTextColor: '$primaryButtonColor',
  $textButtonTextFontSize: 16,
  $actionIconPadding: 4,
  $actionIconSizeAddition: '$actionIconPadding*2',
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
    elevation: 1,
  },
  actionFullWidth: {
    backgroundColor: '$primaryButtonColor',
    alignSelf: 'stretch',
    height: 56,
    borderRadius: '$actionButtonBorderRadius',
  },
  actionText: {
    color: 'white',
    fontSize: '$claimFontSize',
  },
  trackingActionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '$claimFontSize',
    letterSpacing: -0.5,
  },
  trackingAction: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
  },
  textButtonText: {
    color: '$textButtonTextColor',
    fontSize: '$textButtonTextFontSize',
  },
  textButtonSecondaryText: {
    color: '$textButtonTextColor',
    fontSize: '$textButtonTextFontSize',
    fontWeight: '300',
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
  actionIconNavBar: {
    tintColor: '$primaryTextColor',
    width: '$defaultIconSize',
    height: '$defaultIconSize',
    marginLeft: 20,
    marginRight: 20,
  },
  secondaryActionIcon: {
    tintColor: '$secondaryButtonColor',
    width: '$defaultIconSize+$actionIconSizeAddition',
    height: '$defaultIconSize+$actionIconSizeAddition',
    padding: '$actionIconPadding',
  },
})
