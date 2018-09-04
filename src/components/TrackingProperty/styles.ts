import { Dimensions } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

const { height, width } = Dimensions.get('window')


export const responsiveFontSize = (f) => {
  return Math.sqrt((height * height) + (width * width)) * (f / 100)
}

export default EStyleSheet.create({
  container: {
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
})
