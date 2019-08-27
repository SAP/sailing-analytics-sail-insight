import EStyleSheets from 'react-native-extended-stylesheet'
import { Dimensions } from 'react-native'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

const wp = (percentage: number) => Math.round((percentage * viewportWidth) / 100)

const slideWidth = wp(80)

const slideHeight = viewportHeight * 0.60

export const sliderWidth = viewportWidth
export const itemWidth = slideWidth

export default EStyleSheets.create({
  slideInnerContainer: {
    width: slideWidth,
    height: slideHeight,
    backgroundColor: '#F1F9FF',
    flexDirection: 'column',
  },
  slideImageContainer: {
    backgroundColor: '#BCE0FD',
    flex: 9,
  },
  slideTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  }
})
