import React from 'react'
import { View } from 'react-native'
import Text from '../Text'
import styles from './styles'

class ConsoleItem extends React.PureComponent<{
  source: string
  message: string
  timestamp: string,
}> {

  public render() {
    return (
        <View>
          <Text style={[styles.item, styles.itemText, this.props.source === 'expedition' ? styles.green : styles.red]}>
            {this.props.message}
          </Text>
        </View>)
  }
}

export default ConsoleItem
