import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Text,
  TouchableOpacity,
} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'

import { checkIn } from 'actions/checkIn'
import styles from './styles'


class QRScanner extends Component {
  static propTypes = {
    checkIn: PropTypes.func.isRequired,
  }

  onSuccess = (qr) => {
    this.props.checkIn(qr?.data)
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

export default connect(null, { checkIn })(QRScanner)
