import { Platform, StatusBar } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import * as colors from 'styles/colors'
import * as dimensions from 'styles/dimensions'

export const initStyles = () => {
  StatusBar.setBarStyle('dark-content')
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor(colors.$containerBackgroundColor)
  }

  EStyleSheet.build({
    ...colors,
    ...dimensions,
  })
}

export const recalculateStyles = () => {
  EStyleSheet.clearCache()
  EStyleSheet.build()
}
