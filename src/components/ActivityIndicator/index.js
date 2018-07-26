import React from 'react'
import PropStyles from 'prop-types'
import {
  View,
  ActivityIndicator,
} from 'react-native'

import { stylesheetPropType } from 'helpers/propTypes'

import styles from './styles'

const Spinner = ({ size, style }) => (
  <View style={[styles.spinnerStyle, style]}>
    <ActivityIndicator size={size} />
  </View>
)

Spinner.propTypes = {
  size: PropStyles.string,
  style: stylesheetPropType,
}

Spinner.defaultProps = {
  size: 'small',
  style: null,
}

export default Spinner
