import React from 'react'
import {
  Text as RText, TextProps,
} from 'react-native'

import styles from './styles'


class Text extends React.Component<TextProps> {
  public render() {
    const { children, style, ...remainingProps } = this.props
    return (
      <RText
        style={[styles.defaultTextStyle, style]}
        {...remainingProps}
      >
        {children}
      </RText>
    )
  }
}

export default Text
