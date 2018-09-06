import React from 'react'
import { Alert, View } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { connect } from 'react-redux'

import { fetchCheckIn } from 'actions/checkIn'
import Logger from 'helpers/Logger'
import { getUnknownErrorMessage } from 'helpers/texts'
import { navigateBack, navigateToJoinRegatta } from 'navigation'
import { container } from 'styles/commons'
import styles from './styles'

import WaveActivityIndicatorFullscreen from 'components/WaveActivityIndicatorFullscreen'


class QRScanner extends React.Component<{
  navigation: any,
  fetchCheckIn: (url: string) => any,
} > {
  public state = {
    isLoading: false,
  }

  public scanner: any


  public componentDidMount() {
    this.reactivateScanner()
  }


  public onQrScannerRef = (ref: any) => {
    this.scanner = ref
  }

  public reactivateScanner = () => {
    if (!this.scanner || !this.scanner.reactivate) {
      return
    }
    this.scanner.reactivate()
  }

  public collectData = async (url: string) => {
    this.setState({ isLoading: true })
    try {
      const checkIn = await this.props.fetchCheckIn(url)
      navigateBack()
      navigateToJoinRegatta(checkIn)
    } catch (err) {
      Logger.debug(err)
      Alert.alert(getUnknownErrorMessage())
      this.reactivateScanner()
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public onRead = async (qr: any) => {
    if (!qr || !qr.data) {
      return
    }
    return this.collectData(qr.data)
  }

  public render() {
    return (
      <View style={container.main}>
        <QRCodeScanner
          cameraStyle={styles.camera}
          onRead={this.onRead}
          showMarker={true}
          ref={this.onQrScannerRef}
        />
        {this.state.isLoading && <WaveActivityIndicatorFullscreen/>}
      </View>
    )
  }
}

export default connect(null, { fetchCheckIn })(QRScanner)
