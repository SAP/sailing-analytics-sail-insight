import React from 'react'
import PropStyles from 'prop-types'
import {
  View,
  Text,
} from 'react-native'

import { stylesheetPropType } from 'helpers/propTypes'

import styles from './styles'

const RegattaItem = props => (
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
)

RegattaItem.propTypes = {
  regatta: PropStyles.shape({}).isRequired,
  style: stylesheetPropType,
}

RegattaItem.defaultProps = {
  style: null,
}

export default RegattaItem
