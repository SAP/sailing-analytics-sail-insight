import React from 'react'
import { Alert, View } from 'react-native'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import I18n from 'i18n'
import { button, container, image, text } from 'styles/commons'
import styles from './styles'

import { checkIn } from 'actions/checkIn'
import { dateTimeText } from 'helpers/date'
import { getErrorDisplayMessage } from 'helpers/texts'
import { openEmailToContact } from 'helpers/user'
import { CheckIn } from 'models'
import { navigateToSessions } from 'navigation'
import { getCustomScreenParamData } from 'navigation/utils'
import { getEvent } from 'selectors/event'
import { getLeaderboard } from 'selectors/leaderboard'
import { getCompetitor } from 'selectors/competitor'
import { getBoat } from 'selectors/boat'
import { getMark } from 'selectors/mark'
import { getEventLogoImageUrl, getEventPreviewImageUrl } from 'services/SessionService'
import { registration } from 'styles/components'

import EulaLink from 'components/EulaLink'
import IconText from 'components/IconText'
import Image from 'components/Image'
import ImageButton from 'components/ImageButton'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TrackingContext from 'components/session/TrackingContext'

class JoinRegatta extends React.Component<{
  checkInData: CheckIn,
  alreadyJoined: boolean
  leaderboard?: any,
  event?: any,
  competitor?: any,
  boat?: any,
  mark?: any,
  checkIn: (c: CheckIn, aj: boolean) => any,
} > {

  public state = {
    isLoading: false,
    trackingContext: '',
    buttonText: I18n.t('caption_join_race'),
  }

  public onJoinPress = async () => {
    await this.setState({ isLoading: true })
    try {
      await this.props.checkIn(this.props.checkInData, this.props.alreadyJoined)
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
      mark = {}
    } = this.props
    const eventImageUrl = getEventPreviewImageUrl(event)
    const logoImageUrl = getEventLogoImageUrl(event)
    let title = leaderboard.displayName || leaderboard.name
    title = event.name && event.name !== title ? `${title}\n(${event.name})` : title

    this.getTrackingContext()

    return (
      <ScrollContentView>
        <View style={container.stretchContent}>
          <Image style={image.headerLarge} source={eventImageUrl || Images.header.sailors}/>
          {logoImageUrl && <Image style={[image.logoAbsoluteLeft, styles.logo]} source={logoImageUrl}/>}
          <Image style={image.tagLine} source={Images.corporateIdentity.sapTagLine}/>
          <View style={[styles.textContainer, registration.topContainer()]}>
            <Text style={registration.claim()}>
              {title}
            </Text>
            <Text style={[text.propertyValue, styles.timeText]}>{dateTimeText(event.startDate)}</Text>
            {
              event.venue &&
              event.venue.name &&
              event.venue.name !== 'default' &&
              <IconText
                style={styles.location}
                iconStyle={styles.locationIcon}
                textStyle={[text.propertyValue, styles.locationText]}
                source={Images.info.location}
                alignment="horizontal"
              >
                {event.venue && event.venue.name}
              </IconText>
            }
            <TrackingContext session={{
              trackingContext: this.state.trackingContext,
              competitor,
              boat,
              mark
            }} />
          </View>
        </View>
        <View style={registration.bottomContainer()}>
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.onJoinPress}
            isLoading={this.state.isLoading}
          >
            {this.state.buttonText}
          </TextButton>
          <EulaLink mode="JOIN"/>
          <TextButton
            style={registration.lowerButton()}
            textStyle={button.textButtonSecondaryText}
            onPress={openEmailToContact}
          >
            {I18n.t('caption_need_help')}
          </TextButton>
        </View>
        <ImageButton
            style={button.closeButton}
            source={Images.actions.close}
            onPress={navigateToSessions}/>
      </ScrollContentView>
    )
  }
}

interface ScreenParamProps {
  checkInData: CheckIn
  alreadyJoined: boolean
}

const mapStateToProps = (state: any, props: any) => {
  const { checkInData, alreadyJoined }: ScreenParamProps = getCustomScreenParamData(props) || {}

  return {
    checkInData,
    alreadyJoined,
    event: getEvent(checkInData.eventId)(state),
    leaderboard: getLeaderboard(checkInData.leaderboardName)(state),
    competitor: getCompetitor(checkInData.competitorId)(state),
    boat: getBoat(checkInData.boatId)(state),
    mark: getMark(checkInData.markId)(state),
  }
}

export default connect(mapStateToProps, { checkIn })(JoinRegatta)

