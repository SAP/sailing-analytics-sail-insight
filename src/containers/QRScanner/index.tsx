import React from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'

import { navigateBack } from 'navigation'
import styles from './styles'


class QRScanner extends React.Component<{
  navigation: any,
} > {

  public onRead = async (qr: any) => {
    if (!qr || !qr.data) {
      return
    }
    navigateBack()
    const successAction =
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.onSuccess
    if (!successAction) {
      return
    }
    await successAction(qr.data)
  }

  public render() {
    return (
      <QRCodeScanner
        cameraStyle={styles.camera}
        onRead={this.onRead}
        showMarker={true}
      />
    )
  }
}

export default QRScanner
