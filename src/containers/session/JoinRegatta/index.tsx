import React from 'react'
import { always, cond, prop, T } from 'ramda'
import { Alert, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import RNPickerSelect from 'react-native-picker-select'
import { Chevron } from 'react-native-shapes'

import { archiveEvent } from 'actions/events'
import { navigateToTracking, registerCompetitorAndDevice } from 'actions/sessions'

import { CheckIn } from 'models'

import { getCustomScreenParamData, getScreenParamsFromProps } from 'navigation/utils'

import { getBoat } from 'selectors/boat'
import { getCompetitor } from 'selectors/competitor'
import { getEvent } from 'selectors/event'
import { getLeaderboard } from 'selectors/leaderboard'
import { getMark } from 'selectors/mark'
import { isNetworkConnected as isNetworkConnectedSelector } from 'selectors/network'
import { getUserTeams } from 'selectors/user'

import { getEventLogoImageUrl, getEventPreviewImageUrl } from 'services/SessionService'

import { doesCheckInContainBinding } from 'helpers/checkIn'
import { dateRangeText } from 'helpers/date'
import { showNetworkRequiredSnackbarMessage } from 'helpers/network'
import { getErrorDisplayMessage } from 'helpers/texts'
import { openEmailToContact } from 'helpers/user'
import * as Screens from 'navigation/Screens'

import EulaLink from 'components/EulaLink'
import IconText from 'components/IconText'
import Image from 'components/Image'
import ScrollContentView from 'components/ScrollContentView'
import TrackingContext from 'components/session/TrackingContext'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import I18n from 'i18n'

import Images from '@assets/Images'
import styles from './styles'
import { text, button, image, form } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

export enum JoinRegattaActionType {
  Track = 'TRACK',
  JoinEvent = 'JOIN_EVENT',
  JoinAsCompetitor = 'JOIN_AS_COMPETITOR'
}

class JoinRegatta extends React.Component<{
  checkInData: CheckIn,
  actionType: any,
  isNetworkConnected: boolean,
  leaderboard?: any,
  event?: any,
  competitor?: any,
  boat?: any,
  mark?: any,
  boats?: any,
  registerCompetitorAndDevice: any
  navigateToTracking: any
} > {

  public state = {
    isLoading: false,
    selectedBoatIndex: 0
  }

  public onJoinPress = async () => {
    const { actionType, boats, checkInData, isNetworkConnected } = this.props

    if (!isNetworkConnected) {
      showNetworkRequiredSnackbarMessage()
      return
    }

    const { selectedBoatIndex } = this.state
    const checkInContainsBinding = doesCheckInContainBinding(checkInData)
    // The checkInContainsBinding condition is to make sure that the selectedBoat is falsy
    // when binding to the object specified in the checkIn
    const selectedBoat = checkInContainsBinding
      ? undefined
      : boats.length > 0 && boats[selectedBoatIndex]

    // const continueJoining = await this.props.preventDuplicateCompetitorBindings(
    //   checkInData, selectedBoat
    // )

    this.setState({ isLoading: true })

    try {
      // if (!continueJoining) {
      //   await this.props.archiveEvent(checkInData, false)
      //   this.props.navigateToTracking(this.props.navigation)
      //   return
      // }

      const handleRegistration = (options = {}) => {
        const action = boat => this.props.registerCompetitorAndDevice(
          checkInData,
          boat,
          options,
          this.props.navigation
        )

        if (!checkInContainsBinding && boats.length === 0) {
          return this.props.navigation.navigate(Screens.RegisterBoat, { actionAfterSubmit: action })
        }
        return action(selectedBoat)
      }

      switch (actionType) {
        case JoinRegattaActionType.JoinEvent:
          await handleRegistration()
          break
        case JoinRegattaActionType.Track:
          await handleRegistration({ startTrackingAfter: true })
          break
        case JoinRegattaActionType.JoinAsCompetitor:
          await handleRegistration()
          break
      }
    } catch (err) {
      console.error(err)
      Alert.alert(getErrorDisplayMessage(err))
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public render() {
    const {
      checkInData,
      boats = [],
      event = {},
      leaderboard = {},
      competitor = {},
      boat = {},
      mark = {},
    } = this.props
    const { selectedBoatIndex } = this.state

    const eventImageUrl = getEventPreviewImageUrl(event)
    const logoImageUrl = getEventLogoImageUrl(event)
    let title = leaderboard.displayName || leaderboard.name
    title = event.name && event.name !== title ? `${title}\n(${event.name})` : title

    const trackingContext = cond([
      [prop('competitorId'), always('COMPETITOR')],
      [prop('boatId'), always('BOAT')],
      [prop('markId'), always('MARK')],
      [T, always(undefined)],
    ])(checkInData)

    const buttonText = cond([
      [prop('competitorId'), always(I18n.t('caption_join_race_as_competitor'))],
      [prop('boatId'), always(I18n.t('caption_join_race_as_boat'))],
      [prop('markId'), always(I18n.t('caption_join_race_as_mark'))],
      [T, always(I18n.t('caption_join_race'))],
    ])(checkInData)

    const trackingContextUndefined = trackingContext === undefined

    const firstBoat = boats.length !== 0 && boats[0]
    const boatPickerItems = boats.map((boat, index) => ({
      label: boat.name || '',
      value: index
    }))

    return (
      <ImageBackground source={Images.defaults.dots} style={{ width: '100%', height: '100%' }}>
        <LinearGradient colors={[$siTransparent, $siDarkBlue]} style={{ width: '100%', height: '100%' }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.65 }}>
          <ScrollContentView style={styles.container}>
            <View style={styles.contentContainer}>
              <View style={[image.siHeaderLarge, styles.header]}>
                <Image style={styles.eventImage} source={eventImageUrl || Images.header.sailors} />
                <Image style={[styles.poweredByLogo]} source={Images.defaults.poweredBySAP}/>
              </View>
              <View style={styles.textContainer}>
                {logoImageUrl && <Image style={[image.siLogoAbsoluteLeft, styles.logo]} source={logoImageUrl}/>}
                <View style={[styles.headingBlock, (logoImageUrl ? styles.indentHeadingBlock : undefined) ]}>
                  <View style={styles.dateAndLocation}>
                    <Text style={[text.text]}>{dateRangeText(event.startDate, event.endDate)}</Text>
                    {
                      event.venue &&
                      event.venue.name &&
                      event.venue.name !== 'default' &&
                      <IconText
                        style={styles.location}
                        iconStyle={styles.locationIcon}
                        textStyle={[text.text, styles.locationText]}
                        source={Images.info.location}
                        alignment="horizontal"
                      >
                        {event.venue && event.venue.name}
                      </IconText>
                    }
                  </View>
                  <Text style={[text.h2]}>{title}</Text>
                </View>
              </View>
              <View style={styles.textContainer}>
                <TrackingContext
                  session={{
                    trackingContext,
                    competitor,
                    boat,
                    mark
                  }}/>
                { (trackingContextUndefined && boats.length === 1) &&
                  <>
                    <Text style={text.text}>{I18n.t('text_join_with_boat_01')}<Text style={text.yellow}>{firstBoat.name}</Text>{I18n.t('text_join_with_boat_02')}</Text>
                    <Text style={text.text}>{I18n.t('text_join_with_boat_explainer_01')}{I18n.t('text_join_with_boat_explainer_02')}{I18n.t('text_join_with_boat_explainer_03')}</Text>
                  </>
                }
                { (trackingContextUndefined && boats.length > 1) &&
                  <>
                    <Text style={[text.text, styles.pickText]}>{I18n.t('text_join_with_boat_choose')}</Text>
                    <View style={[form.formSelectInputWrapper]}>
                      <View style={[form.formSelectInputAndLabelContainer]}>
                        <Text style={form.formSelectLabel}>{I18n.t('text_join_with_boat_select_label')}</Text>
                        <RNPickerSelect
                            items={boatPickerItems}
                            value={selectedBoatIndex}
                            Icon={() => {
                              return <Chevron size={1.2} color="white" />; // Could this be done in form.ts common styling?
                            }}
                            onValueChange={this.onBoatPickerSelect}
                            useNativeAndroidPickerStyle={false}
                            style={{
                              iconContainer: { right: 4, top: 8 },
                              inputIOS: { ...form.formSelectInput },
                              inputAndroid: { ...form.formSelectInput },
                            }} />
                      </View>
                    </View>
                  </>
                }
                <View style={[styles.eulaField]}>
                  <EulaLink mode="JOIN" />
                </View>
                <TextButton
                  style={[button.primary, button.fullWidth, styles.joinButton]}
                  textStyle={button.primaryText}
                  onPress={this.onJoinPress}
                  isLoading={this.state.isLoading}>
                    {buttonText.toUpperCase()}
                </TextButton>
                <TextButton
                  textStyle={text.text}
                  onPress={openEmailToContact}>
                    {I18n.t('caption_need_help')}
                </TextButton>
              </View>
            </View>
          </ScrollContentView>
        </LinearGradient>
      </ImageBackground>
    )
  }
  private gotoAccountPage = () => {
    return this.props.navigation.navigate(Screens.Account)
  }

  private onBoatPickerSelect = (selectedBoatIndex: any) => {
    this.setState({ selectedBoatIndex })
  }
}

const mapStateToProps = (state: any, props: any) => {
  const checkInData = getCustomScreenParamData(props)
  const actionType = getScreenParamsFromProps(props).actionType

  return {
    actionType,
    checkInData,
    isNetworkConnected: isNetworkConnectedSelector(state),
    event: getEvent(checkInData.eventId)(state),
    leaderboard: getLeaderboard(checkInData.leaderboardName)(state),
    competitor: getCompetitor(checkInData.competitorId)(state),
    boat: getBoat(checkInData.boatId)(state),
    mark: getMark(checkInData.markId)(state),
    boats: getUserTeams(state)
  }
}

export default connect(
  mapStateToProps,
  { archiveEvent, navigateToTracking, registerCompetitorAndDevice },
)(JoinRegatta)

