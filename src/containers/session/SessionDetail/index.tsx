import { connectActionSheet } from '@expo/react-native-action-sheet'
import { isEmpty } from 'lodash'
import React from 'react'
import { Alert, Linking, ListViewDataSource, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'

import { checkIn, checkOut } from 'actions/checkIn'
import { container } from 'styles/commons'

import {
  startLocationTracking,
  stopLocationTracking,
} from 'actions/locations'
import { settingsWithCheckoutActionSheetOptions } from 'helpers/actionSheets'
import { getUnknownErrorMessage } from 'helpers/texts'
import { getListViewDataSource, notImplementedYetAlert } from 'helpers/utils'
import I18n from 'i18n'
import { CheckIn } from 'models'
import { navigateBack, navigateToTracking } from 'navigation'
import { getSessionTracks } from 'selectors/checkIn'
import { getLocationTrackingStatus } from 'selectors/location'
import * as CheckInService from 'services/CheckInService'
import { LocationTrackingStatus } from 'services/LocationService'
import styles from './styles'

import { fetchAllRaces, fetchRegatta } from 'actions/regattas'
import ListView from 'components/ListView'
import SessionInfoDisplay from 'components/session/SessionInfoDisplay'
import TrackInfo from 'components/session/TrackInfo'
import TrackItem from 'components/session/TrackItem'
import Text from 'components/Text'
import { getRaces } from 'selectors/regatta'


const TRACKS_DATA_KEY = 'tracks'

@connectActionSheet
class SessionDetail extends React.Component<NavigationScreenProps & {
  checkOut: (checkIn: CheckIn) => void,
  startLocationTracking: (leaderboardName: string, eventId?: string) => void,
  stopLocationTracking: () => void,
  locationTrackingStatus?: string,
  checkInData: CheckIn,
  showActionSheetWithOptions: any,
  trackDataSource: ListViewDataSource,
  fetchRegatta: (n: string) => void,
  fetchAllRaces: (n: string) => void,
} > {

  public state = {
    isLoading: false,
  }

  public componentDidMount() {
    const { checkInData } = this.props
    this.props.navigation.setParams({
      heading: checkInData.event && checkInData.event.name,
      subHeading: checkInData.leaderboardName,
      onOptionsPressed: this.onOptionsPressed,
    })
    this.props.fetchRegatta(checkInData.leaderboardName)
    this.props.fetchAllRaces(checkInData.leaderboardName)
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

  public renderItem = (track: any) => {
    return <TrackItem track={track}/>
  }

  public onSettingsPress = () => {
    // TODO: navigate to session settings
    notImplementedYetAlert()
  }

  public renderSessionDetails = () => {
    return (
      <View
        style={[
          styles.header,
          this.props.trackDataSource.getRowCount() > 0 ? styles.headerWithTracks : undefined,
        ]}
      >
        <SessionInfoDisplay
          session={this.props.checkInData}
          eventImageSize="large"
          onSettingsPress={this.onSettingsPress}
          onTrackingPress={this.onTrackingPress}
        />
        <TrackInfo style={styles.sidePadding}/>
      </View>
    )
  }

  public renderSectionHeader = (data: any, category: any) => {
    return (
      <View style={styles.sectionHeaderContainer}>
        {
          !isEmpty(data) &&
          <Text style={styles.sectionHeader}>
            {category === TRACKS_DATA_KEY ? I18n.t('text_tracks').toUpperCase() : category}
          </Text>
        }
      </View>
    )
  }

  public render() {
    const { trackDataSource } = this.props
    return (
      <View style={container.list}>
        <ListView
          bounces={trackDataSource.getRowCount() > 0}
          dataSource={trackDataSource}
          renderRow={this.renderItem}
          renderHeader={this.renderSessionDetails}
          renderSectionHeader={this.renderSectionHeader}
        />
      </View>
    )
  }
}

const mapStateToProps = (state: any, props: any) => {
  const checkInData = props.navigation.state.params
  return {
    checkInData,
    locationTrackingStatus: getLocationTrackingStatus(state),
    trackDataSource: getListViewDataSource({
      [TRACKS_DATA_KEY]: getRaces(checkInData.leaderboardName)(state),
    }),
  }
}

export default connect(mapStateToProps, {
  checkOut,
  startLocationTracking,
  stopLocationTracking,
  fetchRegatta,
  fetchAllRaces,
})(SessionDetail)
