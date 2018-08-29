import { StatusBar } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import { isPlatformAndroid } from 'helpers/environment'
import * as colors from 'styles/colors'
import * as dimensions from 'styles/dimensions'
import * as fonts from 'styles/fonts'

export const initStyles = () => {
  StatusBar.setBarStyle('dark-content')
  if (isPlatformAndroid) {
    StatusBar.setBackgroundColor(colors.$primaryBackgroundColor)
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
