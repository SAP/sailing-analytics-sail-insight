import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'

import styles from './styles'


class QRScanner extends Component {
  onSuccess=(e) => {
    console.log(e)
  }

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        topContent={(
          <Text style={styles.centerText}>
            Go to
            {' '}
            <Text style={styles.textBold}>
wikipedia.org/wiki/QR_code
            </Text>
            {' '}
on your computer and scan the QR code.
          </Text>
)}
        bottomContent={(
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>
OK. Got it!
            </Text>
          </TouchableOpacity>
)}
      />
    )
  }
}

export default QRScanner
