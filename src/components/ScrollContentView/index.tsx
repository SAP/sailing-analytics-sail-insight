import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { StyleSheetType } from 'helpers/types'
import { container } from 'styles/commons'


class ScrollContentView extends React.Component<{
  style?: StyleSheetType,
  contentContainerStyle?: StyleSheetType,
  bounces?: boolean,
  extraHeight?: number,
}> {

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
