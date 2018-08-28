import React from 'react'
import {
  Text as RText,
} from 'react-native'

import { StyleSheetType } from 'helpers/types'
import styles from './styles'


class Text extends React.Component<{
  style?: StyleSheetType,
} > {
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
