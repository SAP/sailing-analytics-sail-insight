import React from 'react'
import {
  View,
} from 'react-native'


import Text from 'components/Text'
import { StyleSheetType } from 'helpers/types'
import { text } from 'styles/commons'
import styles from './styles'

class PropertyView extends React.Component<{
  propertyKey?: string,
  propertyValue?: string,
  style?: StyleSheetType,
} > {
  public render() {
    const {
      style,
      propertyKey,
      propertyValue,
    } = this.props


    return (
      <View style={[styles.container, style]}>
        <Text style={[text.propertyName, styles.propertyKey]}>
          {propertyKey && propertyKey.toUpperCase()}
        </Text>
        <Text style={[text.propertyValue, styles.propertyValue]}>
          {propertyValue}
        </Text>
      </View>
    )
  }
}


export default PropertyView
