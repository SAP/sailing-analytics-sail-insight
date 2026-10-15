import React, { useContext } from 'react'
import { StyleSheet } from 'react-native'
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs'

import { container } from 'styles/commons'


const ScrollContentView = ({
  children,
  style,
  contentContainerStyle,
  bounces = false,
  ...props
}: KeyboardAwareScrollViewProps) => {
  const { bottom } = useSafeAreaInsets()
  // Inside a bottom tab navigator the tab bar already keeps clear of the system
  // navigation bar; elsewhere (edge-to-edge) the content must be padded itself.
  const isAboveTabBar = useContext(BottomTabBarHeightContext) !== undefined
  const baseContentStyle = StyleSheet.flatten([container.content, contentContainerStyle])
  const basePaddingBottom = Number(baseContentStyle?.paddingBottom ?? baseContentStyle?.paddingVertical ?? baseContentStyle?.padding) || 0
  const bottomInsetStyle = isAboveTabBar || !bottom ? undefined : { paddingBottom: basePaddingBottom + bottom }
  return (
    <KeyboardAwareScrollView
      style={[container.main, style]}
      contentContainerStyle={[baseContentStyle, bottomInsetStyle]}
      bounces={bounces}
      keyboardShouldPersistTaps="handled"
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  )
}

export default ScrollContentView
