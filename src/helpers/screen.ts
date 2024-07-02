import { Dimensions, PixelRatio } from 'react-native'


export const responsiveFontSize = (percentage: number, height: number) =>
  (PixelRatio.getPixelSizeForLayoutSize(height) * percentage) / PixelRatio.get()

export const isPortrait = () =>
  Dimensions.get('window').height >= Dimensions.get('window').width

export const getWindowWidth = () =>
  isPortrait() ? Dimensions.get('window').width : Dimensions.get('window').height
    
export const getWindowHeight = () =>
  isPortrait() ? Dimensions.get('window').height : Dimensions.get('window').width

