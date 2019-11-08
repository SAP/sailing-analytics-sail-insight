import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  titleLeftContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
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
    fontSize: '$regularFontSize',
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
    fontSize: '$largeFontSize',
    fontWeight: 'bold',
    letterSpacing: -0.08,
  },
  actionIcon: {
    width: '$defaultIconSize',
    height: '$defaultIconSize',
    tintColor: '$primaryTextColor',
    resizeMode: 'contain',
  },
  rightIconContainer: {
    width: 0,
    height: 0,
  },
  rightIcon: {
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
