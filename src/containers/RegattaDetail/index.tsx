import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { Alert, Linking, View } from 'react-native'
import { connect } from 'react-redux'

import { checkOut } from 'actions/checkIn'
import I18n from 'i18n'
import { buttons, container } from 'styles/commons'

import GradientContainer from 'components/GradientContainer'
import TextButton from 'components/TextButton'

import {
  startLocationTracking,
  stopLocationTracking,
} from 'actions/locations'
import { settingsWithCheckoutActionSheetOptions } from 'helpers/actionSheets'
import { getUnknownErrorMessage } from 'helpers/texts'
import { CheckIn } from 'models'
import { navigateBack, navigateToTracking } from 'navigation'
import { getLocationTrackingStatus } from 'selectors/location'
import * as CheckInService from 'services/CheckInService'
import { LocationTrackingStatus } from 'services/LocationService'
import styles from './styles'


@connectActionSheet
class RegattaDetail extends React.Component<{
  checkOut: (checkIn: CheckIn) => void,
  startLocationTracking: (leaderboardName: string, eventId: string) => void,
  stopLocationTracking: () => void,
  locationTrackingStatus?: string,
  checkInData: CheckIn,
  showActionSheetWithOptions: any,
  navigation: any,
} > {

  public state = {
    isLoading: false,
  }

  public componentDidMount() {
    const { checkInData = {} }: any = this.props
    this.props.navigation.setParams({
      heading: checkInData.event && checkInData.event.name,
      subHeading: checkInData.leaderboardName,
      onOptionsPressed: this.onOptionsPressed,
    })
  }

  public onCheckoutPressed = async () => {
    try {
      await this.props.checkOut(this.props.checkInData)
      navigateBack()
    } catch (err) {
      Alert.alert(getUnknownErrorMessage())
    }
  }

  public onOptionsPressed = () => {
    this.props.showActionSheetWithOptions(...settingsWithCheckoutActionSheetOptions(this.onCheckoutPressed))
  }

  public onTrackingPress = async () => {
    await this.setState({ isLoading: true })
    try {
      if (this.props.locationTrackingStatus === LocationTrackingStatus.RUNNING) {
        await this.props.stopLocationTracking()
      } else {
        const { checkInData } = this.props
        await this.props.startLocationTracking(checkInData.leaderboardName, checkInData.eventId)
        navigateToTracking(checkInData)
      }
    } catch (err) {
      Alert.alert(getUnknownErrorMessage())
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public onEventPress = () => {
    Linking.openURL(CheckInService.eventUrl(this.props.checkInData))
  }

  public onLeaderboardPress = () => {
    Linking.openURL(CheckInService.leaderboardUrl(this.props.checkInData))
  }

  public render() {
    const isRunning = this.props.locationTrackingStatus === LocationTrackingStatus.RUNNING
    return (
      <GradientContainer style={[container.main, styles.container]}>
        <View style={styles.detailButtonContainer}>
          <TextButton
            textStyle={buttons.actionText}
            style={[buttons.actionFullWidth, styles.detailButton]}
            onPress={this.onEventPress}
          >
            {I18n.t('caption_to_event')}
          </TextButton>
          <TextButton
            textStyle={buttons.actionText}
            style={[buttons.actionFullWidth, styles.detailButton]}
            onPress={this.onLeaderboardPress}
          >
            {I18n.t('caption_to_leaderboard')}
          </TextButton>
        </View>
        <TextButton
          textStyle={buttons.actionText}
          style={buttons.actionFullWidth}
          onPress={this.onTrackingPress}
          isLoading={this.state.isLoading}
        >
          {isRunning ? I18n.t('caption_stop_tracking') : I18n.t('caption_start_tracking')}
        </TextButton>
      </GradientContainer>
    )
  }
}

const mapStateToProps = (state: any, props: any) => ({
  locationTrackingStatus: getLocationTrackingStatus(state),
  checkInData: props.navigation.state.params,
})

export default connect(mapStateToProps, {
  checkOut,
  startLocationTracking,
  stopLocationTracking,
})(RegattaDetail)
