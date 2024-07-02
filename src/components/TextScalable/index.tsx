import React from 'react'
import {
  Text as RText, TextProps, Platform,
} from 'react-native'

import ScalableText from 'react-native-text'

import styles from './styles'

const PlatformText = Platform.select({
  ios: () => RText,
  android: () => ScalableText,
})();

class Text extends React.Component<TextProps> {
  public render() {
    const { children, style, ...remainingProps } = this.props
    return (
      <PlatformText
        style={[styles.defaultTextStyle, style]}
        {...remainingProps}
      >
        {children}
      </PlatformText>
    )
  }
}

export default Text