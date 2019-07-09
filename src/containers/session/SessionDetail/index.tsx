import { curry } from 'ramda'

import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'

import { checkOut, collectCheckInData } from 'actions/checkIn'
import { Session } from 'models'
import { getCustomScreenParamData } from 'navigation/utils'
import { getSession } from 'selectors/session'

import Text from 'components/Text'
import IconText from 'components/IconText'

import Images from '@assets/Images'
import { container } from 'styles/commons'
import styles from './styles'

const iconText = (icon: String, text?: String) =>
  <IconText
    source={icon}
    iconTintColor={'#5B97F8'}>
    {text}
  </IconText>;

const toTouchableCard = curry(({ onPress, icon }, content: any) =>
  <TouchableOpacity onPress={onPress} style={styles.card}>
    { iconText(icon) }
    <View style={styles.cardContent}>
      { content }
    </View>
    <View style={{ justifyContent: 'center'}}>
      { iconText(Images.actions.arrowRight) }
    </View>
  </TouchableOpacity>);

const overallStatus = (session?: Session) => toTouchableCard({
    onPress: () => console.log('press'),
    icon: Images.info.boat
  }, [
    <Text>Everything is <Text style={{ color: 'green'}}>good</Text></Text>,
    <Text>Race 1 is currently running</Text>,
    <Text>All trackers are sending location updates.</Text>
  ]);

const sessionDetails = (session?: Session) => toTouchableCard({
  onPress: () => console.log('press'),
  icon: Images.info.competitor
  }, [
    <Text>Wednesday Regatta</Text>,
    <Text>10.07.2019</Text>,
    <Text>Handicap Regatta</Text>,
    <Text>Rating System</Text>
  ]);

const typeAndBoatClass = (session?: Session) => toTouchableCard({
  onPress: () => console.log('press'),
  icon: Images.info.location
  }, [
    <Text>Regatta Type and Boat Class</Text>,
    <Text>One Design Regatta</Text>
  ]);

const racesAndScoring = (session?: Session) => toTouchableCard({
  onPress: () => console.log('press'),
  icon: Images.actions.share
  }, [
    <Text>Races and Scoring</Text>,
    <Text>10 Races Planned</Text>,
    <Text>Low Point Scoring</Text>,
    <Text>Discard starting from 3. race</Text>
  ]);

const competitors = (session?: Session) => toTouchableCard({
  onPress: () => console.log('press'),
  icon: Images.info.competitor
  }, [
    <Text>Competitors</Text>,
    <Text>Unmanaged Regatta – 7 Entries</Text>,
    <Text>Invitations: 4 / Acceptations: 2</Text>
  ]);

const SessionDetail: React.SFC<NavigationScreenProps & {
  session?: Session,
}> = ({ session, navigation }) =>
  <View style={[ container.list, styles.cardsContainer ]}>
    {[
      overallStatus(session),
      sessionDetails(session),
      typeAndBoatClass(session),
      racesAndScoring(session),
      competitors(session)
      ]}
  </View>;

const mapStateToProps = (state: any, props: any) => {
  const leaderboardName = getCustomScreenParamData(props)
  return {
    session: getSession(leaderboardName)(state)
  }
}

export default connect(mapStateToProps, {
  checkOut,
  collectCheckInData,
})(SessionDetail)

