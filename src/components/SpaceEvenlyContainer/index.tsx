import { get } from 'lodash'
import React from 'react'
import { View } from 'react-native'

import { StyleSheetType } from 'helpers/types'
import styles from './styles'


class SpaceEvenlyContainer extends React.Component<{
  style?: StyleSheetType,
  children: any[],
} > {
  public state = {
    maxWidth: 20,
    maxHeight: 20,
  }

  public handleLayout = (event: any) => {
    const width = get(event, 'nativeEvent.layout.width')
    const height = get(event, 'nativeEvent.layout.height')
    if (width && width > this.state.maxWidth) {
      this.setState({ maxWidth: width })
    }
    if (height && height > this.state.maxHeight) {
      this.setState({ maxHeight: height })
    }
  }

  public getSizeStyle = () => {
    return {
      minWidth: this.state.maxWidth,
      minHeight: this.state.maxHeight,
    }
  }

  public renderChild = (child: any) => {
    return (
      <View
        key={`${child.key || JSON.stringify(child.props.children)}_evenly_spaced`}
        style={this.getSizeStyle()}
        onLayout={this.handleLayout}
      >
        {child}
      </View>
    )
  }

  public render() {
    const { children, style, ...remaining } = this.props
    return (
      <View style={[styles.defaultContainer, style]} {...remaining}>
        {children && children.map(this.renderChild)}
      </View>
    )
  }
}

export default SpaceEvenlyContainer
