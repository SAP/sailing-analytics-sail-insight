import { StatusBar } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import * as colors from 'styles/colors'
import * as dimensions from 'styles/dimensions'

export const initStyles = () => {
  StatusBar.setBarStyle('dark-content')
  StatusBar.setBackgroundColor(colors.$containerBackgroundColor)

  EStyleSheet.build({
    ...colors,
    ...dimensions,
  })
}

export const recalculateStyles = () => {
  EStyleSheet.clearCache()
  EStyleSheet.build()
}
