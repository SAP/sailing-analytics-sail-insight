import React from 'react'
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view'

import { container } from 'styles/commons'


class ScrollContentView extends React.Component<KeyboardAwareScrollViewProps> {
  public render() {
    const {
      children,
      style,
      contentContainerStyle,
      bounces = false,
      ...props
    } = this.props
    return (
      <KeyboardAwareScrollView
        style={[container.main, style]}
        contentContainerStyle={[container.content, contentContainerStyle]}
        bounces={bounces}
        keyboardShouldPersistTaps="handled"
        {...props}
      >
        {children}
      </KeyboardAwareScrollView>
    )
  }
}

export default ScrollContentView
