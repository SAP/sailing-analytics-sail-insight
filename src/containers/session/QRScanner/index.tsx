import React from 'react'
import { Alert, Text, View } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { connect } from 'react-redux'

import { fetchCheckIn, isEventAlreadyJoined } from 'actions/checkIn'
import Logger from 'helpers/Logger'
import { showNetworkRequiredAlert } from 'helpers/network'
import { getErrorDisplayMessage, getErrorTitle } from 'helpers/texts'
import I18n from 'i18n'
import * as Screens from 'navigation/Screens'
import WaveActivityIndicatorFullscreen from 'components/WaveActivityIndicatorFullscreen'
import { getActiveCheckInEntity } from 'selectors/checkIn'
import { isNetworkConnected } from 'selectors/network'

import styles from './styles'

class QRScanner extends React.Component<{
  fetchCheckIn: (url: string) => any,
  activeCheckIns: any,
  isNetworkConnected: boolean
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
      const activeCheckIns = this.props.activeCheckIns
      const alreadyJoined = isEventAlreadyJoined(checkIn, activeCheckIns)

      this.props.navigation.goBack()
      this.props.navigation.navigate(Screens.JoinRegatta, { data: { checkInData: checkIn, alreadyJoined } })
    } catch (err) {
      Logger.debug(err)
      const title = getErrorTitle()
      let message = getErrorDisplayMessage(err)
      if (err && err.name === 'AuthException') {
        message = I18n.t('error_regatta_access_forbidden')
      }

      Alert.alert(
        title,
        message,
        [
          { text: I18n.t('caption_ok'), onPress: this.reactivateScanner },
        ],
        { cancelable: false },
      )
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public onRead = async (qr: any) => {
    if (!qr || !qr.data) {
      return
    }

    if (!this.props.isNetworkConnected) {
      showNetworkRequiredAlert()
      return
    }
    return this.collectData(qr.data)
  }

  public render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner
          cameraStyle={styles.camera}
          markerStyle={styles.marker}
          onRead={this.onRead}
          showMarker={true}
          ref={this.onQrScannerRef}
        />
        {this.state.isLoading && <WaveActivityIndicatorFullscreen/>}
        <View style={styles.bottomInfoField}>
          <View style={styles.infoBalloon}>
            <Text style={styles.infoBalloonText}>{I18n.t('text_place_QR_code')}</Text>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    activeCheckIns: getActiveCheckInEntity(state) || {},
    isNetworkConnected: isNetworkConnected(state),
  }
}

export default connect(mapStateToProps, { fetchCheckIn })(QRScanner)
