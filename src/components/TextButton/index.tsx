import React from 'react'
import { TextStyle } from 'react-native'

import BaseButton from 'components/base/BaseButton'
import Text from 'components/Text'


class TextButton extends BaseButton<{
  textStyle?: TextStyle,
} > {

  public renderContent = () => {
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
