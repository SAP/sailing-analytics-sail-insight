import React from 'react'
import { TextStyle } from 'react-native'

import BaseButton from 'components/base/BaseButton'
import Text from 'components/TextScalable'


class TextButton extends BaseButton<{
  textStyle?: TextStyle,
  children?: React.ReactNode,
} > {

  public renderContent = (): React.ReactNode => {
    const {
      children,
      textStyle,
    } = this.props
    return (
      <Text style={textStyle}>
        {children}
      </Text>
    )
  }
}


export default TextButton
