import React from 'react'
import {
  View, ViewProps,
} from 'react-native'

import { text } from 'styles/commons'
import styles from './styles'

import Text from 'components/Text'


class PropertyView extends React.Component<ViewProps & {
  propertyKey?: string,
  propertyValue?: string,
  error?: any,
} > {
  public render() {
    const {
      style,
      propertyKey,
      propertyValue,
      error,
    } = this.props


    return (
      <View style={[styles.container, style]}>
        <Text style={[text.propertyName, styles.propertyKey]}>
          {propertyKey && propertyKey.toUpperCase()}
        </Text>
        <Text style={[text.propertyValue, styles.propertyValue, error ? styles.error : undefined]}>
          {propertyValue}
        </Text>
      </View>
    )
  }
}


export default PropertyView
