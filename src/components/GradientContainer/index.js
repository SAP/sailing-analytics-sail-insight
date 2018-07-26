import React from 'react'
import PropTypes from 'prop-types'
import LinearGradient from 'react-native-linear-gradient'

import {
  $containerBackgroundLowerColor,
  $containerBackgroundUpperColor,
} from 'styles/colors'


const GradientContainer = props => (
  <LinearGradient
    start={{ x: 0.0, y: 0.0 }}
    end={{ x: 0.0, y: 1.0 }}
    colors={[$containerBackgroundUpperColor, $containerBackgroundLowerColor]}
    {...props}
  >
    {props.children}
  </LinearGradient>
)

GradientContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
}

GradientContainer.defaultProps = {
  children: null,
}

export default GradientContainer
