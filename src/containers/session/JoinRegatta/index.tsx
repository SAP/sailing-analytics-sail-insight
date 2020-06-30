import React from 'react'
import { Alert, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import RNPickerSelect from 'react-native-picker-select'
import { Chevron } from 'react-native-shapes'

import { checkIn } from 'actions/checkIn'
import { registerCompetitorAndDevice } from 'actions/sessions'

import { CheckIn } from 'models'

import { getCustomScreenParamData, getScreenParamsFromProps } from 'navigation/utils'

import { getBoat } from 'selectors/boat'
import { getCompetitor } from 'selectors/competitor'
import { getEvent } from 'selectors/event'
import { getLeaderboard } from 'selectors/leaderboard'
import { getMark } from 'selectors/mark'
import { getUserTeams } from 'selectors/user'

import { getEventLogoImageUrl, getEventPreviewImageUrl } from 'services/SessionService'

import { dateRangeText } from 'helpers/date'
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
  leaderboard?: any,
  event?: any,
  competitor?: any,
  boat?: any,
  mark?: any,
  boats?: any,
  checkIn: (c: CheckIn, navigation:object) => any,
  registerCompetitorAndDevice: any
} > {

  public state = {
    isLoading: false,
    trackingContext: undefined,
    buttonText: I18n.t('caption_join_race'),
    selectedBoatIndex: 0
  }

  public onJoinPress = async () => {
    const { actionType, boats } = this.props
    const { selectedBoatIndex } = this.state
    const selectedBoat = boats.length > 0 && boats[selectedBoatIndex]
    await this.setState({ isLoading: true })
    try {
      const handleRegistration = (options = {}) => {
        const action = boat => this.props.registerCompetitorAndDevice(
          this.props.checkInData,
          boat,
          options,
          this.props.navigation
        )

        if (boats.length === 0) {
          return this.props.navigation.navigate(Screens.RegisterBoat, { actionAfterSubmit: action })
        }
        return action(selectedBoat)
      }

      switch (actionType) {
        case JoinRegattaActionType.JoinEvent:
          // await this.props.checkIn(this.props.checkInData, this.props.navigation)
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

  public getTrackingContext() {
    const { checkInData } = this.props

    if (checkInData.competitorId) {
      this.state.trackingContext = 'COMPETITOR'
      this.state.buttonText = I18n.t('caption_join_race_as_competitor')
    } else if (checkInData.boatId) {
      this.state.trackingContext = 'BOAT'
      this.state.buttonText = I18n.t('caption_join_race_as_boat')
    } else if (checkInData.markId) {
      this.state.trackingContext = 'MARK'
      this.state.buttonText = I18n.t('caption_join_race_as_mark')
    }
  }

  public render() {
    const {
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

    this.getTrackingContext()

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
                { boats.length === 1 &&
                  <>
                    <Text style={text.text}>You will join this race with <Text style={text.yellow}>{firstBoat.name}</Text>.</Text>
                    <Text style={text.text}>Visit the <Text style={text.yellow} onPress={this.gotoAccountPage}>account settings</Text> to edit this boat or create a new one.</Text>
                  </>
                }
                { boats.length > 1 &&
                  <>
                    <Text style={text.text}>Pick the boat you will be sailing with.</Text>
                    <Text style={form.formSelectLabel}>Boat Class</Text>
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
                        }}
                    />
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
                    {this.state.buttonText.toUpperCase()}
                </TextButton>
                <TextButton
                  textStyle={text.text}
                  onPress={openEmailToContact}>
                    {I18n.t('caption_need_help')}
                </TextButton>
              </View>
            </View>
            <TrackingContext
                textStyle={{ color: '#FFFFFF' }}
                session={{
                  trackingContext: this.state.trackingContext,
                  competitor,
                  boat,
                  mark
                }}/>
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
    event: getEvent(checkInData.eventId)(state),
    leaderboard: getLeaderboard(checkInData.leaderboardName)(state),
    competitor: getCompetitor(checkInData.competitorId)(state),
    boat: getBoat(checkInData.boatId)(state),
    mark: getMark(checkInData.markId)(state),
    boats: getUserTeams(state)
  }
}

export default connect(mapStateToProps, { checkIn, registerCompetitorAndDevice })(JoinRegatta)

