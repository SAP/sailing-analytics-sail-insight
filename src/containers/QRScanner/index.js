import React, { Component } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'

import styles from './styles'


class QRScanner extends Component {
  onRead = (qr) => {
    if (!qr?.data) {
      return
    }
    this?.props?.navigation?.goBack?.()
    this?.props?.navigation?.state?.params?.onSuccess?.(qr?.data)
  }

  render() {
    return (
      <QRCodeScanner
        cameraStyle={styles.camera}
        onRead={this.onRead}
        showMarker
      />
    )
  }
}

export default QRScanner
