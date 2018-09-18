import React from 'react'
import {
  Image, View, ViewProps,
} from 'react-native'

import styles from './styles'

import Text from 'components/Text'


class TrackInfoItem extends React.Component<ViewProps & {
  title?: string,
  iconSource?: any,
} > {

  public state: {valueContainerHeight?: number} = { valueContainerHeight: undefined }

  public render() {
    const {
      style,
      iconSource,
      title,
      children,
    } = this.props

    return (
      <View style={[styles.container, style]}>
        {iconSource && <Image style={styles.icon} source={iconSource}/>}
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title && title.toUpperCase()}</Text>
          </View>
          {children}
        </View>
      </View>
    )
  }

}

export default TrackInfoItem
