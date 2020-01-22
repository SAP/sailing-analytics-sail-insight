import { StatusBar } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import { isPlatformAndroid } from 'environment'
import * as colors from 'styles/colors'
import * as dimensions from 'styles/dimensions'
import * as fonts from 'styles/fonts'

export const initStyles = () => {
  StatusBar.setBarStyle('light-content', true)
  if (isPlatformAndroid) {
    StatusBar.setBackgroundColor('transparent')
    StatusBar.setTranslucent(true)
  }

  EStyleSheet.build({
    ...colors,
    ...dimensions,
    ...fonts,
  })
}

export const recalculateStyles = () => {
  EStyleSheet.clearCache()
  EStyleSheet.build()
}
