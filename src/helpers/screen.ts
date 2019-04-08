import { PixelRatio } from 'react-native'


export const responsiveFontSize = (percentage: number, height: number) =>
  (PixelRatio.getPixelSizeForLayoutSize(height) * percentage) / PixelRatio.get()
