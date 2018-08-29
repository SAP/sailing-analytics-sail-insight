import React from 'react'
import { ScrollView } from 'react-native'

import { StyleSheetType } from 'helpers/types'
import { container } from 'styles/commons'


class ScrollContentView extends React.Component<{
  style?: StyleSheetType,
  contentContainerStyle?: StyleSheetType,
  bounces?: boolean,
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
      <ScrollView
        style={[container.main, style]}
        contentContainerStyle={[container.content, contentContainerStyle]}
        bounces={bounces}
        {...props}
      >
        {children}
      </ScrollView >
    )
  }
}

export default ScrollContentView
