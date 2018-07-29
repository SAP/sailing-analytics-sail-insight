import React, { Component } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'

import NavigationService from 'navigation/NavigationService'
import styles from './styles'


class QRScanner extends Component {
  onRead = async (qr) => {
    if (!qr?.data) {
      return
    }
    NavigationService.navigateBack()
    await this?.props?.navigation?.state?.params?.onSuccess?.(qr?.data)
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
