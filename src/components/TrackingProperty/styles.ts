import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  title: {
    color: '$secondaryTextColor',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  value: {
    color: '$primaryTextColor',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.8,
  },
  unit: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.08,
  },
  actionIcon: {
    width: '$defaultIconSize',
    height: '$defaultIconSize',
    tintColor: '$primaryTextColor',
    resizeMode: 'contain',
  },
  tendencyIconContainer: {
    width: 0,
    height: 0,
  },
  tendencyIcon: {
    tintColor: 'white',
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  tendencyIconUp: {
    backgroundColor: '$improvementColor',
  },
  tendencyIconDown: {
    backgroundColor: '$declineColor',
  },
})
