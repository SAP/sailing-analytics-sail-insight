import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  icon: {
    width: '$defaultIconSize',
    height: '$defaultIconSize',
    marginRight: 5,
    tintColor: '$secondaryTextColor',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  titleContainer: {
    justifyContent: 'center',
    height: '$defaultIconSize',
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '$secondaryTextColor',
  },
})
