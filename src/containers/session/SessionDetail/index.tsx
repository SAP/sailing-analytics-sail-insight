import { connectActionSheet } from '@expo/react-native-action-sheet'
import { isEmpty } from 'lodash'
import React from 'react'
import { Alert, Linking, SectionList, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'

import { checkOut, collectCheckInData } from 'actions/checkIn'
import { openTrackDetails } from 'actions/navigation'
import {  startTracking, StartTrackingAction } from 'actions/tracking'
import { settingsWithCheckoutActionSheetOptions } from 'helpers/actionSheets'
import { getErrorDisplayMessage } from 'helpers/texts'
import { getStatsFromTracks, listKeyExtractor } from 'helpers/utils'
import I18n from 'i18n'
import { CheckIn, Race, Session } from 'models'
import { navigateBack } from 'navigation'
import { getCustomScreenParamData } from 'navigation/utils'
import { getRaces } from 'selectors/race'
import * as CheckInService from 'services/CheckInService'
import { getSession } from 'selectors/session'

import { container, button } from 'styles/commons'
import styles from './styles'

import SessionInfoDisplay from 'components/session/SessionInfoDisplay'
import TrackInfo from 'components/session/TrackInfo'
import TrackItem from 'components/session/TrackItem'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

const TRACKS_DATA_KEY = 'tracks'

@connectActionSheet
class SessionDetail extends React.Component<NavigationScreenProps & {
  openTrackDetails: (race: Race) => void,
  checkOut: (checkIn?: CheckIn) => void,
  startTracking: StartTrackingAction,
  session?: Session,
  showActionSheetWithOptions: any,
  tracks: Race[],
  collectCheckInData: (c?: CheckIn) => void,
} > {

  public state = {
    isLoading: false,
  }

  public componentDidMount() {
    const { session } = this.props
    this.props.navigation.setParams({
      heading: session && (session.userStrippedDisplayName || session.leaderboardName),
      onOptionsPressed: this.onOptionsPressed,
    })
    this.props.collectCheckInData(session)
  }

  public onCheckoutPressed = async () => {
    try {
      await this.props.checkOut(this.props.session)
      navigateBack()
    } catch (err) {
      Alert.alert(getErrorDisplayMessage(err))
    }
  }

  public onOptionsPressed = () => {
    this.props.showActionSheetWithOptions(...settingsWithCheckoutActionSheetOptions(this.onCheckoutPressed))
  }

  public onTrackingPress = async () => {
    await this.setState({ isLoading: true })
    try {
      await this.props.startTracking(this.props.session)
    } catch (err) {
      Alert.alert(getErrorDisplayMessage(err))
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public onEventPress = () => {
    Linking.openURL(CheckInService.eventUrl(this.props.session))
  }

  public onLeaderboardPress = () => {
    Linking.openURL(CheckInService.leaderboardUrl(this.props.session))
  }

  public onTrackPress = (race: Race) => () => {
    this.props.openTrackDetails(race)
  }

  public renderItem = ({ item }: any) => {
    return <TrackItem onPress={this.onTrackPress(item)} track={item} showFullTrackName={false} />
  }

  public renderSessionDetails = () => {
    const { session, tracks } = this.props
    if (!session) {
      return <View/>
    }
    return (
      <View
        style={[
          styles.header,
          this.props.tracks.length > 0 ? styles.headerWithTracks : undefined,
        ]}
      >
        <SessionInfoDisplay
          session={session}
          eventImageSize="large"
          onTrackingPress={this.onTrackingPress}
        />
        { session.isSelfTracking &&
          <TextButton
            style={[button.trackingAction, styles.betaButton]}
            textStyle={styles.betaButtonText}
            onPress={this.showBetaAlert}
          >
            {I18n.t('caption_beta_session')}
          </TextButton>
        }
        <TrackInfo stats={getStatsFromTracks(tracks)}  style={styles.sidePadding}/>
      </View>
    )
  }

  public showBetaAlert = () => {
    Alert.alert(
      I18n.t('caption_beta_self_tracking'),
      I18n.t('text_beta_self_tracking')
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
  const leaderboardName = getCustomScreenParamData(props)
  return {
    session: getSession(leaderboardName)(state),
    tracks: getRaces(leaderboardName)(state) || [],
  }
}

export default connect(mapStateToProps, {
  checkOut,
  startTracking,
  collectCheckInData,
  openTrackDetails,
})(SessionDetail)
