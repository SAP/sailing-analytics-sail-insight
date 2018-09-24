import { connectActionSheet } from '@expo/react-native-action-sheet'
import { isEmpty } from 'lodash'
import React from 'react'
import { Alert, Linking, SectionList, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'


import { checkOut, collectCheckInData } from 'actions/checkIn'
import {  openLocationTracking } from 'actions/locations'
import { openTrackDetails } from 'actions/navigation'
import { settingsWithCheckoutActionSheetOptions } from 'helpers/actionSheets'
import { getUnknownErrorMessage } from 'helpers/texts'
import { listKeyExtractor, notImplementedYetAlert } from 'helpers/utils'
import I18n from 'i18n'
import { CheckIn, Race, Session } from 'models'
import { navigateBack } from 'navigation'
import { getRaces } from 'selectors/race'
import * as CheckInService from 'services/CheckInService'

import { container } from 'styles/commons'
import styles from './styles'

import SessionInfoDisplay from 'components/session/SessionInfoDisplay'
import TrackInfo from 'components/session/TrackInfo'
import TrackItem from 'components/session/TrackItem'
import Text from 'components/Text'


const TRACKS_DATA_KEY = 'tracks'

@connectActionSheet
class SessionDetail extends React.Component<NavigationScreenProps & {
  openTrackDetails: (race: Race) => void,
  checkOut: (checkIn: CheckIn) => void,
  openLocationTracking: (checkIn: CheckIn) => void,
  checkInData: Session,
  showActionSheetWithOptions: any,
  tracks: Race[],
  collectCheckInData: (c: CheckIn) => void,
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
    this.props.collectCheckInData(checkInData)
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
      await this.props.openLocationTracking(this.props.checkInData)
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

  public onTrackPress = (race: Race) => () => {
    this.props.openTrackDetails(race)
  }

  public renderItem = ({ item }: any) => {
    return <TrackItem onPress={this.onTrackPress(item)} track={item}/>
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
          this.props.tracks.length > 0 ? styles.headerWithTracks : undefined,
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

  public renderSectionHeader = ({ section: { title, data } }: any) => {
    return (
      <View style={styles.sectionHeaderContainer}>
        {
          !isEmpty(data) &&
          <Text style={styles.sectionHeader}>
            {title === TRACKS_DATA_KEY ? I18n.t('text_tracks').toUpperCase() : title}
          </Text>
        }
      </View>
    )
  }

  public render() {
    const { tracks } = this.props
    return (
      <View style={container.list}>
        <SectionList
          bounces={tracks.length > 0}
          sections={[{ title: TRACKS_DATA_KEY, data: tracks }]}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderSessionDetails}
          renderSectionHeader={this.renderSectionHeader}
          keyExtractor={listKeyExtractor}
        />
      </View>
    )
  }
}

const mapStateToProps = (state: any, props: any) => {
  const checkInData = props.navigation.state.params
  return {
    checkInData,
    tracks: getRaces(checkInData.leaderboardName)(state) || [],
  }
}

export default connect(mapStateToProps, {
  checkOut,
  openLocationTracking,
  collectCheckInData,
  openTrackDetails,
})(SessionDetail)
