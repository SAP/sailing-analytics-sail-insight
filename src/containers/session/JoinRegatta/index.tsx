import React from 'react'
import { Alert, View } from 'react-native'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import I18n from 'i18n'
import { button, container, image, text } from 'styles/commons'
import styles from './styles'

import { checkIn } from 'actions/checkIn'
import { dateTimeText } from 'helpers/date'
import { getUnknownErrorMessage } from 'helpers/texts'
import { CheckIn } from 'models'
import { getCustomScreenParamData } from 'navigation/utils'
import { getEvent } from 'selectors/event'
import { getLeaderboard } from 'selectors/leaderboard'
import { getEventLogoImageUrl, getEventPreviewImageUrl } from 'services/SessionService'
import { registration } from 'styles/components'

import IconText from 'components/IconText'
import Image from 'components/Image'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'


class JoinRegatta extends React.Component<{
  checkInData: CheckIn,
  leaderboard?: any,
  event?: any,
  checkIn: (c: CheckIn) => any,
} > {

  public state = { isLoading: false }

  public onJoinPress = async () => {
    await this.setState({ isLoading: true })
    try {
      await this.props.checkIn(this.props.checkInData)
    } catch (err) {
      Alert.alert(getUnknownErrorMessage())
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public render() {
    const { event = {}, leaderboard = {} } = this.props
    const eventImageUrl = getEventPreviewImageUrl(event)
    const logoImageUrl = getEventLogoImageUrl(event)
    let title = leaderboard.displayName || leaderboard.name
    title = event.name !== title ? `${title}\n(${event.name})` : title
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
            <IconText
              style={styles.location}
              iconStyle={styles.locationIcon}
              textStyle={[text.propertyValue, styles.locationText]}
              source={Images.info.location}
              alignment="horizontal"
            >
              {event.venue && event.venue.name}
            </IconText>
          </View>
        </View>
        <View style={registration.bottomContainer()}>
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.onJoinPress}
            isLoading={this.state.isLoading}
          >
            {I18n.t('caption_join_race')}
          </TextButton>
          <TextButton
            style={registration.lowerButton()}
            textStyle={button.textButtonSecondaryText}
          >
            {I18n.t('caption_need_help')}
          </TextButton>
        </View>
      </ScrollContentView >
    )
  }
}

const mapStateToProps = (state: any, props: any) => {
  const checkInData: CheckIn = getCustomScreenParamData(props) || {}
  return {
    checkInData,
    event: getEvent(checkInData.eventId)(state),
    leaderboard: getLeaderboard(checkInData.leaderboardName)(state),
  }
}

export default connect(mapStateToProps, { checkIn })(JoinRegatta)
