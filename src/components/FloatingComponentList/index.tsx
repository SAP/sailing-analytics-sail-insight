import React from 'react'
import { FlatList, FlatListProps, View } from 'react-native'

import { listKeyExtractor } from 'helpers/utils'

import { container } from 'styles/commons'
import { isPlatformAndroid } from '../../environment'
import styles from './styles'

class FloatingComponentList<ItemType> extends React.Component<FlatListProps<ItemType> & {
  renderFloatingItem?: () => Element | JSX.Element,
}> {

  public state = {
    hideFloatingComponent: false,
  }

  public render() {
    const { style, renderFloatingItem, ...remainingProps } = this.props
    return (
      <View style={[container.list, style]}>
        <FlatList
          onScrollBeginDrag={this.hideAdd}
          onScrollEndDrag={isPlatformAndroid ? undefined : this.showAdd}
          onMomentumScrollBegin={isPlatformAndroid ? undefined : this.hideAdd}
          onMomentumScrollEnd={this.showAdd}
          keyExtractor={listKeyExtractor}
          {...remainingProps}
        />
        {
          !renderFloatingItem || this.state.hideFloatingComponent ? undefined :
          <View style={styles.floatingComponent}>{renderFloatingItem()}</View>
        }
      </View>
    )
  }

  protected showAdd = () => {
    this.setState({ hideFloatingComponent: false })
  }

  protected hideAdd = () => {
    this.setState({ hideFloatingComponent: true })
  }

}

export default FloatingComponentList
