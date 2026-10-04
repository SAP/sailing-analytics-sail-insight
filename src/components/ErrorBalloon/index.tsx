import React from 'react'
import { Image, View } from 'react-native'

import ConnectedErrorDetails from 'components/ConnectedErrorDetails'
import Text from 'components/Text'

import Images from '../../../assets/Images'
import styles from './styles'

interface Props {
  message?: string | null
  // raw error, for the (optional) technical details
  error?: any
}

const ErrorBalloon = ({ message, error }: Props) => message ? (
  <View style={styles.container}>
    <View style={styles.redBalloon}>
      <Image resizeMode="contain" style={styles.attention} source={Images.defaults.attention} />
      <Text style={styles.redBalloonText}>{message}</Text>
    </View>
    <ConnectedErrorDetails error={error} />
  </View>
) : null

export default ErrorBalloon
