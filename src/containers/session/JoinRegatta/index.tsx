import React from 'react'
import { Alert, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'

import { checkIn } from 'actions/checkIn'

import { CheckIn } from 'models'

import { getCustomScreenParamData } from 'navigation/utils'

import { getBoat } from 'selectors/boat'
import { getCompetitor } from 'selectors/competitor'
import { getEvent } from 'selectors/event'
import { getLeaderboard } from 'selectors/leaderboard'
import { getMark } from 'selectors/mark'

import { getEventLogoImageUrl, getEventPreviewImageUrl } from 'services/SessionService'

import { dateRangeText } from 'helpers/date'
import { getErrorDisplayMessage } from 'helpers/texts'
import { openEmailToContact } from 'helpers/user'

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
import { text, button, image } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

class JoinRegatta extends React.Component<{
  checkInData: CheckIn,
  leaderboard?: any,
  event?: any,
  competitor?: any,
  boat?: any,
  mark?: any,
  checkIn: (c: CheckIn, aj: boolean, navigation:object) => any,
} > {

  public state = {
    isLoading: false,
    trackingContext: undefined,
    buttonText: I18n.t('caption_join_race'),
  }

  public onJoinPress = async () => {
    await this.setState({ isLoading: true })
    try {
      await this.props.checkIn(this.props.checkInData, this.props.navigation)
    } catch (err) {
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
      event = {},
      leaderboard = {},
      competitor = {},
      boat = {},
      mark = {},
    } = this.props
    const eventImageUrl = getEventPreviewImageUrl(event)
    const logoImageUrl = getEventLogoImageUrl(event)
    let title = leaderboard.displayName || leaderboard.name
    title = event.name && event.name !== title ? `${title}\n(${event.name})` : title

    this.getTrackingContext()

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
                { true && // TODO if user is logged in and has one boat
                  <Text style={text.text}>Boat Selector bit goes here</Text>
                }
                { true && // TODO if user is logged in and has multiple boats
                  <Text style={text.text}>Boat Selector bit goes here</Text>
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
}

const mapStateToProps = (state: any, props: any) => {
  const checkInData = getCustomScreenParamData(props)

  return {
    checkInData,
    event: getEvent(checkInData.eventId)(state),
    leaderboard: getLeaderboard(checkInData.leaderboardName)(state),
    competitor: getCompetitor(checkInData.competitorId)(state),
    boat: getBoat(checkInData.boatId)(state),
    mark: getMark(checkInData.markId)(state)
  }
}

export default connect(mapStateToProps, { checkIn })(JoinRegatta)

