import React from 'react'
import PropStyles from 'prop-types'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'

import { stylesheetPropType } from 'helpers/propTypes'

import styles from './styles'

const RegattaItem = props => (
  <TouchableOpacity
    onPress={props.onPress}
    disabled={!props.onPress}
  >
    <View style={[styles.container, props.style]}>
      <View>
        <Text>
          {props.regatta?.event?.name}
        </Text>
        <Text>
          {props.regatta?.leaderboard?.name}
        </Text>
      </View>
      <View>
        <Text>
          {props.regatta?.competitor?.name || props?.regatta?.mark?.name || props?.regatta?.boat?.name}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
)

RegattaItem.propTypes = {
  regatta: PropStyles.shape({}).isRequired,
  onPress: PropStyles.func,
  style: stylesheetPropType,
}

RegattaItem.defaultProps = {
  style: null,
  onPress: null,
}

export default RegattaItem
